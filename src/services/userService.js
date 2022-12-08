import db from '../models/index'
import bcrypt from 'bcryptjs';


const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword =  await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
            
        } catch (error) {
            reject(e);
        }
    })
}

const handleUserLogin = (userEmail, password) => {
    return new Promise( async (resolve, reject) => {
        try {

            let userData = {};
            let isExit = await checkUserEmail(userEmail);

            if(isExit){
                // user already exist
                // compare password

                const user = await db.User.findOne({
                    where: {email: userEmail},
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true
                })


                if(user) {
                    let check =  bcrypt.compareSync(password, user.password);
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok',

                        delete user['password'];
                        userData.user = user;
                    }else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = `user not found`
                }


                resolve(userData)
            }else{
                // return error
                userData.errCode = 1;
                userData.errMessage = `your email isn't exist in your system`
                resolve(userData)
            }
        } catch (e) {
            reject(e);
        }
    })
}


const checkUserEmail = (userEmail) => {
    return new Promise( async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if(user) {
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}


const compareUserPassword = (userPassword) => {
    return new Promise( async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {password: userPassword}
            })
            if(user) {
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

const getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if(userId === 'All') {
                users = await db.User.findAll({
                    attributes: {exclude: ['password']},
                    raw: true
                });
            }
            if(userId && userId !== 'All') {
                users = await db.User.findOne({ 
                    where: { id: userId },
                    attributes: {exclude: ['password']},
                    raw: true
                });
            }
            resolve(users);
            
        } catch (error) {
            reject(error);
        }
    })
}

const createNewUser = (data) => {

    return new Promise(async (resolve, reject) => {
        try {

            const checEmail = await checkUserEmail(data.email);
            if(checEmail){
                resolve({
                    errCode: 1,
                    message: 'Your email used, please try another email'
                })
            }
            else {
                const hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar
                })
    
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }
            

        } catch (error) {
            reject(error);
        }
    })
}

const deleteUserById = (userId) => {

    return new Promise(async(resolve, reject) => {
        try {
            const user = await db.User.findOne({ where: { id: userId }});
            if(user){
                await db.User.destroy({ where: { id: userId } });
                resolve({
                     errCode: 0,
                     message: 'The user is deleted'
                })
            }else {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                });
            }
        } catch (error) {
            reject(error);
        }
   })

}



const updateUserData = (data) => {

    return new Promise(async(resolve, reject) => {

        try {
            // console.log("data: ", data)
            if(!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    message: 'missing param'
               });
            }else{
                const user = await db.User.findOne({where: {id: parseInt(data.id)}})
    
                if(user) {
                    const firstName = data.firstName;
                    const lastName = data.lastName;
                    const address = data.address;
                    const userId = parseInt(data.id);
                    const roleId = data.roleId;
                    const positionId = data.positionId;
                    const gender = data.gender;
                    const phoneNumber = data.phoneNumber;
                    const image = data.avatar;
                    
                    await db.User.update({firstName, lastName, address, roleId, positionId, gender, phoneNumber, image},{where: { id: userId }});
                    resolve({
                        errCode: 0,
                        message: 'update the user successfully'
                    });
    
                
    
                }else {
                    resolve({
                        errCode: 1,
                        message: 'user not found'
                   });
                }

            }


        } catch (error) {
            reject(error);
        }
   })
}

const getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try {

            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            }else {

                let res = {}
                let allCode = await db.Allcode.findAll({
                    where: {type: typeInput}
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }

        } catch (error) {
            
        }
    });
}


export default {handleUserLogin, getAllUser, createNewUser, deleteUserById, updateUserData, getAllCodeService}