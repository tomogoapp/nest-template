
export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if (!file) return callback ( new Error('File is Empty'), false)

    const fileExtension = file.mimetype.split('/')[1]
    const validExternsions = ['jpg','jpeg','png','gif']

    if(validExternsions.includes(fileExtension)) {
        return callback(null, true)
    }

    callback(new Error('File type not valid'), true)

}