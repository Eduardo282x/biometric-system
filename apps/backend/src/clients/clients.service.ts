import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDTO } from './clients.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async getClients() {
        return await this.prismaService.client.findMany();
    }

    async findClientByName(clientName: string): Promise<Client> {
        return await this.prismaService.client.findFirst({
            where: {
                name: clientName
            }
        });
    }

    async registerClients(client: ClientDTO) {
        try {
            await this.prismaService.client.create({
                data: {
                    name: client.name,
                    lastName: client.lastName,
                    phone: client.phone,
                    photo: '',
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
