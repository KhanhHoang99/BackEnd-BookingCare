import db from '../models/index'
import bcrypt from 'bcryptjs';

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
                    attributes: ['email', 'roleId', 'password'],
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

export default {handleUserLogin}