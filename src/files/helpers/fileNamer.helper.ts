import { BadRequestException } from "@nestjs/common"
import { v4 as uuid } from "uuid"

export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if (!file) return callback ( new Error('File is Empty'), false)

    const fileExtension = file.mimetype.split('/')[1]

    const fileName = `${uuid()}.${fileExtension}`

    callback (null, fileName)

}

export const fileNameUUID = ( file: Express.Multer.File) => {

    if (!file) return( new BadRequestException('File is Empty'), false)

    const fileExtension = file.mimetype.split('/')[1]

    const fileName = `${uuid()}.${fileExtension}`

    return fileName

}