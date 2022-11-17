import express from 'express';
import homeController from '../controllers/homeController.js';
import userController from '../controllers/userController.js';


const router = express.Router();

const initWebRoutes = (app) => {

    router.get('/crud', homeController.crud);
    router.get('/', homeController.getHomePage);

    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // API

    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode)
    
    return app.use('/', router);
}

export default initWebRoutes;