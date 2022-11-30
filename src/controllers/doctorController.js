import doctorService from '../services/doctorService'

const getTopDoctorHome = async (req, res) => {

    let limit = req.query.limit;
    
    if(!limit){
        limit = 10;
    }
    try {
        let response = await doctorService.handleGetTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getAllDoctors = async (req, res) => {

    try {
        let response = await doctorService.handleGetAllDoctors();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const postInfoDoctor = async (req, res) => {

    try {
        // console.log('req.body: ', req.body)
        let response = await doctorService.handleSaveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getDetailDoctorById = async (req, res) => {

    try {
        let info = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getExtraInforDoctorById = async (req, res) => {

    try {
        let info = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

export default {
    getTopDoctorHome, getAllDoctors, 
    postInfoDoctor, getDetailDoctorById, 
    bulkCreateSchedule, getScheduleByDate,
    getExtraInforDoctorById
}