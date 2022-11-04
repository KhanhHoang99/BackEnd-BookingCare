import express from 'express';
import homeController from '../controllers/homeController.js';


const router = express.Router();

const initWebRoutes = (app) => {

    router.get('/crud', homeController.crud);
    router.get('/', homeController.getHomePage);

    
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    
    return app.use('/', router);
}

export default initWebRoutes;