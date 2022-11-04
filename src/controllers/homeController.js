import db from '../models/index';
import CRUDService from '../services/CRUDService';


const getHomePage = async (req, res) => {

    try {
        const data = await db.User.findAll();
        return res.render('homePage.ejs', {data: data});
    } catch (error) {
        console.log(error)
    }
}

const crud = (req, res) => {
    return res.render('crud.ejs');
}

const postCRUD = async (req, res) => {
    const message = await CRUDService.createNewUser(req.body);
    console.log(message)
    return res.send(JSON.stringify(req.body));
}

const displayGetCRUD = async (req, res) => {
    
    const data = await CRUDService.getAllUser();
    // console.log(data)
    return res.render('displayCRUD.ejs', {data: data});
}

const getEditCRUD = async (req, res) => {

    const userId = req.query.id;
    if(userId) {
        const userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {userData})
    }else{
        return res.send('User not found')
    }
}

const putCRUD = async (req, res) => {
    let data = req.body;

    const allUsers = await CRUDService.updateUserData(data);

    return res.render('displayCRUD.ejs', {data: allUsers});
    
}


export default {getHomePage, crud, postCRUD, displayGetCRUD, getEditCRUD, putCRUD};