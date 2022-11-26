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

            if(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
    
            }else{
                if(inputData.action === 'CREATE'){
                    await db.Markdown.create({
                       contentHTML: inputData.contentHTML,
                       contentMarkdown: inputData.contentMarkdown,
                       description: inputData.description,
                       doctorId: inputData.doctorId
                   })
                }else{
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

                // convert date
                if(existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime();
                        return item;
                    })
                }

                // console.log('existing: ', existing)

                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
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
                })

                console.log('dataSchedule: ', dataSchedule)

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

export default {
    handleGetTopDoctorHome, 
    handleGetAllDoctors, 
    handleSaveDetailInfoDoctor,  
    getDetailDoctorById, 
    bulkCreateSchedule, 
    getScheduleByDate
}