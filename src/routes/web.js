import express from 'express';
import homeController from '../controllers/homeController.js';


const router = express.Router();

const initWebRoutes = (app) => {

    router.get('/crud', homeController.crud);
    router.get('/', homeController.getHomePage);

    
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);

    return app.use('/', router);
}

export default initWebRoutes;