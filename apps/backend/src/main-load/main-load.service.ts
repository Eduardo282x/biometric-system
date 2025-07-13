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

            // Planes
            const planBasico = await this.prisma.plan.create({
                data: {
                    name: 'Plan Básico',
                    price: 25,
                    description: 'Acceso al gimnasio de lunes a viernes',
                },
            });

            const planPremium = await this.prisma.plan.create({
                data: {
                    name: 'Plan Premium',
                    price: 40,
                    description: 'Acceso full + entrenador personalizado',
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
                    planId: planBasico.id,
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
                    planId: planPremium.id,
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

            // Pago por adelantado (cliente2)
            const adelanto = await this.prisma.advancePayment.create({
                data: {
                    clientId: cliente2.id,
                    total: 100,
                    remaining: 50, // ya se usaron 2 mensualidades
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
                        fromAdvancePaymentId: adelanto.id,
                    },
                    {
                        clientId: cliente2.id,
                        userId: gerente.id,
                        methodPayment: 'Transferencia',
                        amount: 25,
                        description: 'Pago agosto desde adelanto',
                        datePay: new Date('2025-08-01'),
                        nextDatePay: new Date('2025-09-01'),
                        fromAdvancePaymentId: adelanto.id,
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
