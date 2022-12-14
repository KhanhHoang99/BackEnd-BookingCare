import clinicService from "../services/clinicService";

const createClinic = async (req, res) => {
    try {
        // console.log('req.body: ', req.body)
        let response = await clinicService.createClinic(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getAllClinic = async (req, res) => {
    try {
        
        let response = await clinicService.getAllClinic();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}


const getDetailClinicById = async (req, res) => {
    try {
        
        let response = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

export default {createClinic, getAllClinic, getDetailClinicById}