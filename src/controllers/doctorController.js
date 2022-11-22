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

export default {getTopDoctorHome, getAllDoctors, postInfoDoctor}