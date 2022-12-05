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


export default {createSpecialty}