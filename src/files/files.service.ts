import { BadRequestException, Injectable } from '@nestjs/common'
import { existsSync } from 'fs'
import { join } from 'path'
import * as AWS from 'aws-sdk'
import {fileNameUUID} from './helpers'

@Injectable()
export class FilesService {
  private s3

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.MINIO_ACCESS_KEY, // Usar variable de entorno
      secretAccessKey: process.env.MINIO_SECRET_KEY, // Usar variable de entorno
      endpoint: process.env.MINIO_ENDPOINT, // Usar variable de entorno
      s3ForcePathStyle: true, // necesario con MinIO
      signatureVersion: 'v4'
    })
  }

/**
 * The function `getStaticProductImage` retrieves the path of a static product image based on the
 * provided image name.
 * @param {string} imageName - The `imageName` parameter in the `getStaticProductImage` function is a
 * string that represents the name of the product image file that you want to retrieve from the static
 * products directory.
 * @returns The function `getStaticProductImage` returns the full path to the static product image file
 * based on the provided `imageName` parameter. If the file does not exist at the specified path, a
 * `BadRequestException` with the message 'file dont found' is thrown.
 */
  getStaticProductImage( imageName: string ){

    const path = join(__dirname,'../../static/products',imageName)

    if( !existsSync(path)){
      throw new BadRequestException('file dont found')
    }

    return path

  }

/**
 * The function `uploadFile` asynchronously uploads a file to an S3 bucket using the AWS SDK.
 * @param file - The `file` parameter in the `uploadFile` function is of type `Express.Multer.File`,
 * which is a type provided by the Multer middleware for handling file uploads in Express.js. It
 * contains information about the file that was uploaded, such as the file buffer, original name, size
 * @returns The `uploadFile` function is returning the result of uploading the file to an S3 bucket
 * using the `s3.upload` method. The `uploadResult` variable contains the result of the upload
 * operation, which includes information such as the location of the uploaded file in the S3 bucket.
 */
  async uploadFile(file: Express.Multer.File) {

    const name = fileNameUUID(file)

    const uploadResult = await this.s3.upload({
      Bucket: process.env.MINIO_BUCKET, // Nombre de tu bucket
      Body: file.buffer,
      //Key: `${Date.now()}-${file.originalname}`
      Key: name

    }).promise()

    return uploadResult
  }

/**
 * This TypeScript function deletes a file from an AWS S3 bucket using the provided key.
 * @param {string} key - The `deleteFile` function you provided is an asynchronous function that
 * deletes a file from an S3 bucket using the AWS SDK. The `key` parameter in this function represents
 * the unique identifier or name of the file that you want to delete from the S3 bucket. When calling
 * this function, you
 * @returns The function `deleteFile` is returning an object with a message property set to 'Archivo
 * Borrado' and a data property containing the result of deleting the file using the AWS S3
 * `deleteObject` method.
 */
  async deleteFile(key:string){

    try{

      const deleteParams = {
        Bucket: process.env.MINIO_BUCKET,
        Key: key
      }

      const data = await this.s3.deleteObject(deleteParams).promise()

      return {
        message: 'Arcxhivo Borrado',
        data:data
      }

    }catch(error){
      throw new Error(`Error: ${error}`)
    }

  } 

}
