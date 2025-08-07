import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDTO } from './clients.dto';
import { diskStorage, memoryStorage } from 'multer';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceService } from './face.service';
import * as path from 'path';
import { FaceRecognitionService } from 'src/face-recognition/face-recognition.service';
import { badResponse, baseResponse } from 'src/base/base.interface';

@Controller('clients')
export class ClientsController {

    constructor(
        private readonly clientService: ClientsService,
        private readonly faceService: FaceService,
        private readonly faceServiceRecognized: FaceRecognitionService,
    ) {

    }

    @Get()
    async getClients() {
        return await this.clientService.getClients();
    }

    @Get('/export')
    async exportClients(@Res() res: Response) {
        return await this.clientService.exportClientsToExcel(res);
    }
    // @Post()
    // async registerClients(@Body() client: ClientDTO) {
    //     return await this.clientService.registerClients(client);
    // }

    @Post('/register')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: path.resolve(__dirname, '..', '..', 'faces'),
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            }
        })
    }))
    async register(@UploadedFile() file, @Body() body: { data: string }) {
        const client: ClientDTO = JSON.parse(body.data);
        return await this.clientService.registerClients(client, file ? file.filename : null)
    }

    @Put('/update/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: path.resolve(__dirname, '..', '..', 'faces'),
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            }
        })
    }))
    async update(@Param('id', ParseIntPipe) id: number, @UploadedFile() file, @Body() body: { data: string }) {
        const client: ClientDTO = JSON.parse(body.data);
        return await this.clientService.updateClients(id, client, file ? file.filename : null)
    }

    @Post('/verify-face')
    @UseInterceptors(FileInterceptor('image', {
        // storage: memoryStorage(),
        storage: diskStorage({
            destination: path.resolve(__dirname, '..', '..', 'temp'),
            filename: (req, file, cb) => {
                cb(null, `verificacion.jpg`);
            }
        })
    }))
    async verifyFace(@UploadedFile() file) {
        if (!file) {
            throw new BadRequestException('No se recibió la imagen');
        }
        const imagePath = path.resolve(__dirname, '..', '..', `temp/verificacion.jpg`)
        try {
            const threshold = 0.6;
            const verificationResult = await this.faceServiceRecognized.verifyClient(
                imagePath,
                threshold
            );

            return verificationResult;
        } catch (err) {
            badResponse.message = err;
            return badResponse;
        }
    }

    @Delete('/:id')
    async deleteClients(@Param('id') id: string) {
        return await this.clientService.deleteClients(Number(id));
    }
}
