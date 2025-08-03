import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDTO, ClientIdentificationDTO } from './clients.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {

    constructor(private readonly prismaService: PrismaService) {

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
        console.log(photo);

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

            await this.prismaService.client.create({
                data: {
                    name: client.name,
                    lastName: client.lastName,
                    phone: client.phone,
                    photo: photo || '',
                    email: client.email,
                    identify: client.identify,
                    address: client.address
                }
            })

            baseResponse.message = 'Cliente guardado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async updateClients(id: number, client: ClientDTO) {
        try {
            await this.prismaService.client.update({
                data: {
                    name: client.name,
                    lastName: client.lastName,
                    phone: client.phone,
                    email: client.email,
                    identify: client.identify,
                },
                where: { id }
            })

            baseResponse.message = 'Cliente actualizado exitosamente.'
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
}
