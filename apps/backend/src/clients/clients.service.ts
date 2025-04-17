import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDTO } from './clients.dto';

@Injectable()
export class ClientsService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async getClients() {
        return await this.prismaService.clients.findMany();
    }

    async registerClients(client: ClientDTO) {
        try {
            await this.prismaService.clients.create({
                data: {
                    name: client.name,
                    lastName: client.lastName,
                    phone: client.phone,
                    photo: client.photo,
                    email: client.email,
                    identify: client.identify,
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
            await this.prismaService.clients.update({
                data: {
                    name: client.name,
                    lastName: client.lastName,
                    phone: client.phone,
                    photo: client.photo,
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
            await this.prismaService.clients.delete({
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
