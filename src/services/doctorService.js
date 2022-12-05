import db from '../models/index';
import * as dotenv from 'dotenv'; 
import _ from "lodash";

dotenv.config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const handleGetTopDoctorHome = (limitInput) => {

    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })

        } catch (error) {
            reject(error);
        }
    })
}

const handleGetAllDoctors = () => {

    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image']
                },
                raw: true,
            })

            resolve({
                errCode: 0,
                data: doctors
            })

        } catch (error) {
            reject(error);
        }
    })
}

const handleSaveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {

            if(
                !inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown  || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment || !inputData.selectedProvince
                || !inputData.nameClinic || !inputData.addressClinic || !inputData.note
            ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
    
            }else{

                // upsert to Markdown
                if(inputData.action === 'CREATE'){
                    await db.Markdown.create({
                       contentHTML: inputData.contentHTML,
                       contentMarkdown: inputData.contentMarkdown,
                       description: inputData.description,
                       doctorId: inputData.doctorId
                   })
                }
                else if(inputData.action === "EDIT"){
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {doctorId: inputData.doctorId},
                        raw: false
                    })

                    if(doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save();
                    }
                }

                // Upsert to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })

                if(doctorInfor) {
                    // update
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    
                    await doctorInfor.save();

                }else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    })
                }
            }

            resolve({
                errCode: 0,
                errMessage: 'Save info doctor success'
            })

        } catch (error) {
            reject(error);
        }
    })
}

const getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            if(!id){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
    
            }else{
                let data = await db.User.findOne({
                    where: {
                        id: id
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},

                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},                              
                                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},                              
                                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},                              
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if(!data) {
                    data = {}
                }

                resolve({
                    errCode: 0,
                    data: data
                })
            }


            resolve({
                errCode: 0,
                errMessage: 'Save info doctor success'
            })

        } catch (error) {
            reject(error);
        }
    })
}

const bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if(!data.arrSchedule || !data.doctorId || !data.date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
    
            }else{

                // get schedule from client
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0) {

                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                // console.log('schedule: ', schedule)


                //get all existing data
                let existing = await db.Schedule.findAll({
                    where: {doctorId: data.doctorId, date: data.date},
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                // console.log('existing: ', existing)

                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                // console.log('check different : ', toCreate)

                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                
                resolve({
                    errCode: 0,
                    errMessage: `Save doctor's schedule success`
                })
            }


        } catch (error) {
            reject(error);
        }
    })
}

const getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {

            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
    
            }else{
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },

                    include: [
                        {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']},
                    ],
                    raw: true,
                    nest: true
                })

                // console.log('dataSchedule: ', dataSchedule)

                if(!dataSchedule) {
                    dataSchedule = []
                }

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

const getExtraInforDoctorById = (inputDoctorId) => {

    return new Promise(async (resolve, reject) => {
        try {
            if(!inputDoctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {

                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputDoctorId  
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},                              
                        {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},                              
                        {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},                              
                    ],
                    raw: true,
                    nest: true
                })

                if(!data) {
                    data = {}
                }


                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const getProfileDoctorById = (doctorId) => {

    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter doctorId'
                })
            }else {

                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},

                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},                              
                                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},                              
                                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},                              
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if(!data) {
                    data = {}
                }

                // console.log('data to react: ',data)

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


export default {
    handleGetTopDoctorHome, 
    handleGetAllDoctors, 
    handleSaveDetailInfoDoctor,  
    getDetailDoctorById, 
    bulkCreateSchedule, 
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
}