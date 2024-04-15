import { 
  BadRequestException, 
  Controller, 
  Delete, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
  Post, 
  Res, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common'
import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { fileNamer,fileFilter } from './helpers/'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
/**
 * The function `findProductImage` retrieves and sends a product image file based on the provided image
 * name.
 * @param {Response} res - The `res` parameter in the `findProductImage` function is used to send the
 * file as a response to the client. It is of type `Response`, which is typically an object
 * representing the HTTP response that Express.js sends when handling a request.
 * @param {string} imageName - The `imageName` parameter is a string that represents the name of the
 * product image that needs to be retrieved and sent back as a response.
 */
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName)

    res.sendFile(path)
  }

  // @Post('product')
  // @UseInterceptors( FileInterceptor('file',{
  //   fileFilter: fileFilter,
  //   // limits: { fileSize: 10240 },
  //   storage: diskStorage({
  //     destination: './static/uploads',
  //     filename: fileNamer
  //   })
  // }) )
  // uploadPorductImage(
  //   @UploadedFile() file:Express.Multer.File
  // ){

  //   if( !file ) {
  //     throw new BadRequestException('File is empty')
  //   }

  //   const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

  //   return {
  //     secureUrl
  //   }
  // }



  @Post('product')
 /* The code snippet you provided is a method in a NestJS controller that handles file uploads. Let's
 break it down: */
  @UseInterceptors(FileInterceptor('file'))
/**
 * The function `uploadFile` asynchronously uploads a file using the `filesService` and returns a
 * success message with the uploaded file data or throws an error if the upload fails.
 * @param file - The `file` parameter in the `uploadFile` function is of type `Express.Multer.File`,
 * which represents a file uploaded through Multer middleware in an Express application. This parameter
 * contains information about the uploaded file, such as its name, size, mimetype, and buffer data. It
 * is
 * @returns an object with a message indicating that the file was uploaded successfully, along with the
 * data returned from the `uploadFile` method of the `filesService`.
 */
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {
      try {
          const uploadResult = await this.filesService.uploadFile(file)
          return {
              message: 'File uploaded successfully',
              data: uploadResult
          };
      } catch (error) {
        console.log(error)
          throw new HttpException('Failedddd to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Delete('product/:filekey')
/**
 * This TypeScript function deletes a file using a file key parameter and handles errors by throwing an
 * HTTP exception if necessary.
 * @param {string} fileKey - The `fileKey` parameter in the `deleteFile` function is a string that
 * represents the key or identifier of the file that needs to be deleted. This key is used to locate
 * and delete the corresponding file from the storage system.
 * @returns The `deleteFile` method is returning the result of the `filesService.deleteFile(fileKey)`
 * operation.
 */
  async deleteFile(
    @Param('filekey') fileKey:string){
      try {
        const result = await this.filesService.deleteFile(fileKey)
        return result
      }catch(error){
        throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  
}
