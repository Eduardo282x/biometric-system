import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MainLoadService {

    constructor(private readonly prisma: PrismaService) {
    }

    async mainLoad() {
        try {
            // Usuarios
            const admin = await this.prisma.user.create({
                data: {
                    username: 'Alvaro01',
                    name: 'Alvaro',
                    lastName: 'Rios',
                    password: 'admin123',
                    role: 'GERENTE',
                },
            });
            const gerente = await this.prisma.user.create({
                data: {
                    username: 'gerente01',
                    name: 'Luis',
                    lastName: 'Martinez',
                    password: 'admin123',
                    role: 'GERENTE',
                },
            });

            const recepcionista = await this.prisma.user.create({
                data: {
                    username: 'recep01',
                    name: 'Carla',
                    lastName: 'Lopez',
                    password: 'pass123',
                    role: 'RECEPCIONISTA',
                },
            });

            // Clientes
            const cliente1 = await this.prisma.client.create({
                data: {
                    name: 'Ana',
                    lastName: 'Gomez',
                    identify: 'V-12345678',
                    email: 'ana@gym.com',
                    phone: '04141234567',
                    address: 'Av. Urdaneta',
                    photo: 'Ana_Gomez.jpg',
                },
            });

            const cliente2 = await this.prisma.client.create({
                data: {
                    name: 'Carlos',
                    lastName: 'Perez',
                    identify: 'V-87654321',
                    email: 'carlos@gym.com',
                    phone: '04149876543',
                    address: 'Calle 100',
                },
            });

            const cliente3 = await this.prisma.client.create({
                data: {
                    name: 'Maria',
                    lastName: 'Torres',
                    identify: 'V-11223344',
                    email: 'maria@gym.com',
                    phone: '04261122334',
                    address: 'Zona Norte',
                },
            });

            // Pago directo (cliente1)
            await this.prisma.payment.create({
                data: {
                    clientId: cliente1.id,
                    userId: recepcionista.id,
                    methodPayment: 'Efectivo',
                    amount: 25,
                    description: 'Pago mensual julio',
                    datePay: new Date('2025-07-01'),
                    nextDatePay: new Date('2025-08-01'),
                },
            });

            await this.prisma.payment.createMany({
                data: [
                    {
                        clientId: cliente2.id,
                        userId: gerente.id,
                        methodPayment: 'Transferencia',
                        amount: 25,
                        description: 'Pago julio desde adelanto',
                        datePay: new Date('2025-07-01'),
                        nextDatePay: new Date('2025-08-01'),
                    },
                    {
                        clientId: cliente2.id,
                        userId: gerente.id,
                        methodPayment: 'Transferencia',
                        amount: 25,
                        description: 'Pago agosto desde adelanto',
                        datePay: new Date('2025-08-01'),
                        nextDatePay: new Date('2025-09-01'),
                    },
                ],
            });
            baseResponse.message = 'Datos cargados exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err;
            return badResponse;
        }
    } 
}
