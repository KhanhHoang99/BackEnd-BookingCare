import express from 'express';
import homeController from '../controllers/homeController.js';
import userController from '../controllers/userController.js';
import doctorController from '../controllers/doctorController.js'
import patientController from '../controllers/patientController.js'
import specialtyController from '../controllers/specialtyController.js'
import clinicController from '../controllers/clinicController.js'


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
    router.get('/api/allcode', userController.getAllCode);


    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    // router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    // router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);









    
    return app.use('/', router);
}

export default initWebRoutes;