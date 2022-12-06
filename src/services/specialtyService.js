import db from '../models/index';


const createSpecialty = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {

                resolve({
                    errCode: 1,
                    errMassage: 'Missing parameter'
                })
            }else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown

                })

                resolve({
                    errCode: 0,
                    errMassage: 'Ok'
                })
            }

        } catch (error) {
            reject(error);
        }
    })

}

const getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                raw: true,
            })

            if(data && data.length > 0) {
                data = data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                data: data
            })

        } catch (error) {
            reject(error);
        }
    })
}

const getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            if(!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMassage: 'Missing parameter'
                })
            }else {

                let data = {}

                data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })

                if(data) {
                    let doctorSpecialty = [];
                    if(location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {SpecialtyId: inputId},
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                SpecialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;
                }else {
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


export default {createSpecialty, getAllSpecialty, getDetailSpecialtyById}