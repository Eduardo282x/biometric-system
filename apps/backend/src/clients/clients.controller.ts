import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDTO, ClientIdentificationDTO } from './clients.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceService } from './face.service';
import path from 'path';

@Controller('clients')
export class ClientsController {

    constructor(
        private readonly clientService: ClientsService,
        private readonly faceService: FaceService,
    ) {

    }

    @Get()
    async getClients() {
        return await this.clientService.getClients();
    }
    @Post()
    async registerClients(@Body() client: ClientDTO) {
        return await this.clientService.registerClients(client);
    }

    @Post('/register')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './faces',
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const name = `${req.body.nombre}_${req.body.apellido}${ext}`;
                cb(null, name);
            }
        })
    }))
    async register(@UploadedFile() file, @Body() body) {
        // Guarda info en base de datos como nombre, apellido, etc.
        // Guarda la ruta de la imagen asociada a ese usuario
        return { message: 'Usuario registrado con imagen' };
    }

    @Post('/verify-face')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './temp',
            filename: (req, file, cb) => {
                cb(null, `verificacion.jpg`);
            }
        })
    }))
    async verifyFace(@UploadedFile() file) {
        const result = await this.faceService.runRecognition();

        // si se identificó correctamente, puedes buscar en la DB
        const user = await this.clientService.findClientByName(result.name);

        return {
            success: result.match,
            nombre: result.name,
            puedeAcceder: result.match,
            // proximaFechaPago: user?.proximaFechaPago || null,
        };
    }

    @Post('/find')
    async findClientByIdentification(@Body() client: ClientIdentificationDTO) {
        return await this.clientService.findClientByIdentification(client);
    }

    @Put('/:id')
    async updateClients(@Param('id') id: string, @Body() client: ClientDTO) {
        return await this.clientService.updateClients(Number(id), client);
    }
    @Delete('/:id')
    async deleteClients(@Param('id') id: string) {
        return await this.clientService.deleteClients(Number(id));
    }
}
