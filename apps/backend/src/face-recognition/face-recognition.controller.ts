import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Controller('face-recognition')
export class FaceRecognitionController {

    constructor(private readonly faceRecognitionService: FaceRecognitionService) { }

    /**
     * Registrar un nuevo cliente con su foto
     */
    @Post('register')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads/clients',
            filename: (req, file, cb) => {
                // Asegurar que el directorio existe
                const uploadPath = './uploads/clients';
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }

                const clientId = req.body.clientId || `client_${Date.now()}`;
                const filename = `${clientId}_${Date.now()}${path.extname(file.originalname)}`;
                cb(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            // Validar que sea una imagen
            if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png)'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    }))
    
    // async registerClient(
    //     @UploadedFile() photo: Express.Multer.File,
    //     @Body('clientId') clientId: string
    // ) {
    //     if (!photo) {
    //         throw new BadRequestException('Se requiere una foto');
    //     }

    //     if (!clientId) {
    //         throw new BadRequestException('Se requiere un ID de cliente');
    //     }

    //     try {
    //         const result = await this.faceRecognitionService.registerClient(
    //             clientId,
    //             photo.path
    //         );

    //         return {
    //             statusCode: result.success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
    //             message: result.message,
    //             data: {
    //                 clientId,
    //                 photoPath: photo.path,
    //                 success: result.success
    //             }
    //         };
    //     } catch (error) {
    //         throw new BadRequestException('Error al procesar la imagen');
    //     }
    // }

    /**
     * Verificar identidad con foto temporal
     */
    // @Post('verify')
    // @HttpCode(HttpStatus.OK)
    // @UseInterceptors(FileInterceptor('photo', {
    //     storage: diskStorage({
    //         destination: './uploads/temp',
    //         filename: (req, file, cb) => {
    //             // Asegurar que el directorio existe
    //             const uploadPath = './uploads/temp';
    //             if (!fs.existsSync(uploadPath)) {
    //                 fs.mkdirSync(uploadPath, { recursive: true });
    //             }

    //             const filename = `verify_${Date.now()}${path.extname(file.originalname)}`;
    //             cb(null, filename);
    //         }
    //     }),
    //     fileFilter: (req, file, cb) => {
    //         if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    //             cb(null, true);
    //         } else {
    //             cb(new BadRequestException('Solo se permiten archivos de imagen'), false);
    //         }
    //     },
    //     limits: {
    //         fileSize: 5 * 1024 * 1024 // 5MB
    //     }
    // }))
    // async verifyClient(
    //     @UploadedFile() photo: Express.Multer.File,
    //     @Body('threshold') threshold?: string
    // ) {
    //     if (!photo) {
    //         throw new BadRequestException('Se requiere una foto para verificación');
    //     }

    //     try {
    //         const thresholdValue = threshold ? parseFloat(threshold) : 0.6;

    //         const result = await this.faceRecognitionService.verifyClient(
    //             photo.path,
    //             thresholdValue
    //         );

    //         // Limpiar el archivo temporal después de la verificación
    //         setTimeout(() => {
    //             try {
    //                 fs.unlinkSync(photo.path);
    //             } catch (error) {
    //                 console.warn('Could not delete temp file:', photo.path);
    //             }
    //         }, 1000);

    //         return {
    //             statusCode: result.success ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    //             message: result.message,
    //             data: {
    //                 verified: result.success,
    //                 clientId: result.clientId || null,
    //                 confidence: result.confidence || 0,
    //                 threshold: thresholdValue
    //             }
    //         };
    //     } catch (error) {
    //         console.error('Verification error:', error);
    //         throw new BadRequestException('Error al procesar la verificación');
    //     }
    // }

    /**
     * Limpiar archivos temporales
     */
    @Post('cleanup')
    @HttpCode(HttpStatus.OK)
    async cleanupTempFiles() {
        try {
            await this.faceRecognitionService.cleanTempFiles();
            return {
                statusCode: HttpStatus.OK,
                message: 'Archivos temporales limpiados exitosamente'
            };
        } catch (error) {
            throw new BadRequestException('Error al limpiar archivos temporales');
        }
    }
}
