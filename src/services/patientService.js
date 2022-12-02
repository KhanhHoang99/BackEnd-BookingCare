import db from '../models/index';
import * as dotenv from 'dotenv'; 
import _ from "lodash";
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';


const buildUrlEmail = (doctorId, token) => {
   
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {

        // console.log('data : ', data)

        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {

                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                      email: data.email,
                      roleId: 'R3'
                    }
                });


                if(user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {patienId: user[0].id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patienId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor Patient succeed'
                })
            }
        } catch (error) {
            // console.log('err: ',error)
            reject(error);
        }
    })
}

const postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {

        // console.log('data : ', data)
        
        try {
            
            if(!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                
                
                if(appointment) {

                    appointment.statusId = 'S2'
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed!'
                    })
                }else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

export default {
    postBookAppointment,
    postVerifyBookAppointment
}