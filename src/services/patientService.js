import db from '../models/index';
import * as dotenv from 'dotenv'; 
import _ from "lodash";
import emailService from './emailService';

const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {

        console.log('data : ', data)

        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {

                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: 'https://www.youtube.com/watch?v=Ws-QlpSltr8'
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
                            timeType: data.timeType
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

export default {
    postBookAppointment
}