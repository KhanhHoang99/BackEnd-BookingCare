import bcrypt from 'bcryptjs';
import db from '../models/index';



const salt = bcrypt.genSaltSync(10);

const createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            const hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })

            resolve("ok! create a new user succeed!")

        } catch (error) {
            reject(error);
        }
    })
}

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

const getAllUser = async () => {

   return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findAll({raw: true});
            resolve(user); //tương đương return user do dùng promise nên phải resolve
        } catch (error) {
            reject(error)
        }
   })
}

const getUserInfoById = (userId) => {

    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({where: {id: userId}, raw: true});
            if(user){
                resolve(user); //tương đương return user do dùng promise nên phải resolve
            }else{
                resolve({});
            }
        } catch (error) {
            reject(error)
        }
   })
}

const updateUserData = (data) => {
    console.log(data);

    const firstName = data.firstName;
    const lastName = data.lastName;
    const address = data.address;
    const userId = parseInt(data.id);

    return new Promise(async(resolve, reject) => {
        try {
           await db.User.update({firstName, lastName, address},{where: { id: userId }});
           const allUsers = await db.User.findAll();
           resolve(allUsers);
        } catch (error) {
            reject(error);
        }
   })
}

const deleteUserById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
           await db.User.destroy({ where: { id: userId } });
           const allUsers = await db.User.findAll();
           resolve(allUsers);
        } catch (error) {
            reject(error);
        }
   })
}

export default {hashUserPassword, createNewUser, getAllUser, getUserInfoById, updateUserData, deleteUserById}