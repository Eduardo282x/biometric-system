import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDTO } from './clients.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { Client } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { FaceRecognitionService } from 'src/face-recognition/face-recognition.service';
@Injectable()
export class ClientsService {
    private readonly clientPhotosPath = path.join(process.cwd(), 'faces');

    constructor(
        private readonly prismaService: PrismaService,
        private readonly faceRecognitionService: FaceRecognitionService
    ) {

    }

    async getClients() {
        return await this.prismaService.client.findMany({
            orderBy: { id: 'asc' }
        });
    }

    async findClientByName(clientName: string): Promise<Client> {
        return await this.prismaService.client.findFirst({
            where: {
                name: clientName
            }
        });
    }

    async registerClients(client: ClientDTO, photo: string | null) {
        try {
            const findDuplicate = await this.prismaService.client.findFirst({
                where: {
                    OR: [
                        { identify: client.identify },
                        { phone: client.phone },
                        { email: client.email }
                    ]
                }
            });

            if (findDuplicate) {
                let duplicateField = '';

                if (findDuplicate.identify === client.identify) {
                    duplicateField = 'la cédula';
                } else if (findDuplicate.phone === client.phone) {
                    duplicateField = 'el teléfono';
                } else if (findDuplicate.email === client.email) {
                    duplicateField = 'el correo electrónico';
                }

                badResponse.message = `Este ${duplicateField} ya está registrado.`;
                return badResponse;
            }


            const clientSave = await this.prismaService.client.create({
                data: {
                    name: client.name,
                    lastName: client.lastName,
                    phone: client.phone,
                    photo: photo || '',
                    email: client.email,
                    identify: client.identify,
                    address: client.address
                }
            });

            if (photo && photo != '') {
                const photoUrl = `${this.clientPhotosPath}/${photo}`
                const descriptor = await this.faceRecognitionService.extractFaceDescriptor(photoUrl);
                const descriptorPath = path.join(this.clientPhotosPath, `${clientSave.id}_descriptor.json`);

                // Crear directorio si no existe
                if (!fs.existsSync(this.clientPhotosPath)) {
                    fs.mkdirSync(this.clientPhotosPath, { recursive: true });
                }
                const descriptorData = {
                    clientId: clientSave.id,
                    descriptor: Array.from(descriptor), // Convertir Float32Array a array normal
                    registeredAt: new Date().toISOString(),
                    photo: photoUrl
                };
                fs.writeFileSync(descriptorPath, JSON.stringify(descriptorData, null, 2));
            }


            baseResponse.message = 'Cliente guardado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async updateClients(id: number, client: ClientDTO, photo: string | null) {
        try {
            await this.prismaService.client.update({
                data: {
                    name: client.name,
                    lastName: client.lastName,
                    phone: client.phone,
                    photo: photo || '',
                    email: client.email,
                    identify: client.identify,
                    address: client.address
                },
                where: { id }
            });

            if (photo && photo != '') {
                const photoUrl = `${this.clientPhotosPath}/${photo}`
                const descriptor = await this.faceRecognitionService.extractFaceDescriptor(photoUrl);
                const descriptorPath = path.join(this.clientPhotosPath, `${id}_descriptor.json`);

                // Crear directorio si no existe
                if (!fs.existsSync(this.clientPhotosPath)) {
                    fs.mkdirSync(this.clientPhotosPath, { recursive: true });
                }
                const descriptorData = {
                    clientId: id,
                    descriptor: Array.from(descriptor), // Convertir Float32Array a array normal
                    registeredAt: new Date().toISOString(),
                    photo: photoUrl
                };
                fs.writeFileSync(descriptorPath, JSON.stringify(descriptorData, null, 2));
            }

            baseResponse.message = 'Cliente guardado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async deleteClients(id: number) {
        try {
            await this.prismaService.client.delete({
                where: { id }
            })

            baseResponse.message = 'Cliente eliminado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }


    async exportClientsToExcel(res: Response) {
        const clients = await this.prismaService.client.findMany();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Clientes');

        worksheet.columns = [
            // { header: 'ID', key: 'id' },
            { header: 'Nombre', key: 'name' },
            { header: 'Apellido', key: 'lastName' },
            { header: 'Cédula', key: 'identify' },
            { header: 'Correo', key: 'email' },
            { header: 'Teléfono', key: 'phone' },
            { header: 'Dirección', key: 'address' },
            { header: 'Fecha Registro', key: 'createdDate' }
        ];

        clients.forEach((client) => worksheet.addRow(client));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=clientes.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    }
}
