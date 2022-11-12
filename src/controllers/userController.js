
import UserService from "../services/UserService";

const handleLogin = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }
    
    let userData = await UserService.handleUserLogin(email, password)

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}  
    })
}


const handleGetAllUsers = async (req, res) => {
    
    let id = req.query.id; //All or id


    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })
    }

    const users = await UserService.getAllUser(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

const handleCreateNewUser =  async (req, res) => {
    const message = await UserService.createNewUser(req.body);
    // console.log(message);
    return res.status(200).json(message)
}

const handleEditUser = async (req, res) => {
    const data = req.body;

    const message = await UserService.updateUserData(data);
    return res.status(200).json(message);
    
}


const handleDeleteUser = async (req, res) => {
    const userId = req.query.id;

    if(!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
        })
    }else {
        const message = await UserService.deleteUserById(userId);
        return res.status(200).json(message);
    }
}

const getAllCode = async (req, res) => {
    try {
        let data = await UserService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log('get all code: ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}

export default {handleLogin, handleGetAllUsers, handleCreateNewUser, handleEditUser, handleDeleteUser, getAllCode}