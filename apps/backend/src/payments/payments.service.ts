import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDTO } from './payment.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { ClientIdentificationDTO } from 'src/clients/clients.dto';

@Injectable()
export class PaymentsService {


    constructor(private readonly prismaService: PrismaService) {

    }

    async getPayment() {
        const payments = await this.prismaService.payment.findMany({
            orderBy: { datePay: 'desc' },
            include: { client: true, user: true }
        });

        const latestPaymentsByClient: { [key: number]: any } = {};
        payments.forEach(payment => {
            if (!latestPaymentsByClient[payment.clientId]) {
                latestPaymentsByClient[payment.clientId] = payment;
            }
        });

        const today = new Date();
        const result = Object.values(latestPaymentsByClient).map((payment: any) => ({
            ...payment,
            status: payment.nextDatePay > today
        }));

        return result;
    }

    async getPaymentClient(client: ClientIdentificationDTO) {
        try {
            const today = new Date();

            const findClient = await this.prismaService.client.findFirst({
                where: { identify: client.identify }
            });

            if (!findClient) {
                badResponse.message = `No se encontró el cliente`
                return badResponse;
            }

            const findClientPayment = await this.prismaService.payment.findFirst({
                where: { client: { identify: client.identify } }
            });

            if (!findClientPayment) {
                badResponse.message = `No se encontró ningún pago de este cliente`
                return badResponse;
            }

            const paymentClient = await this.prismaService.payment.findFirst({
                orderBy: { datePay: 'desc' },
                include: { client: true, user: true },
                where: { client: { identify: client.identify } }
            }).then(item => {
                return {
                    ...item,
                    status: item.nextDatePay > today
                }
            })

            return {
                message: 'Cliente encontrado.',
                success: true,
                data: paymentClient
            };
        } catch (err) {
            badResponse.message = `Ha ocurrido un error ${err.message}`
            return badResponse;
        }
    }

    async getPaymentHistory() {
        return await this.prismaService.payment.findMany({
            orderBy: { datePay: 'desc' },
            include: { client: true, user: true }
        });
    }

    async registerPayment(payment: PaymentDTO) {
        try {
            await this.prismaService.payment.create({
                data: {
                    clientId: payment.clientId,
                    userId: payment.userId,
                    methodPayment: payment.methodPayment,
                    amount: payment.amount,
                    description: payment.description,
                    nextDatePay: payment.nextDatePay,
                }
            })

            baseResponse.message = 'Pago guardado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async updatePayment(id: number, payment: PaymentDTO) {
        try {
            await this.prismaService.payment.update({
                data: {
                    clientId: payment.clientId,
                    userId: payment.userId,
                    methodPayment: payment.methodPayment,
                    amount: payment.amount,
                    description: payment.description,
                    nextDatePay: payment.nextDatePay,
                },
                where: { id }
            })

            baseResponse.message = 'Pago actualizado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async deletePayment(id: number) {
        try {
            await this.prismaService.payment.delete({
                where: { id }
            })

            baseResponse.message = 'Pago eliminado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async exportPaymentsToExcel(res: Response) {
        const payments = await this.prismaService.payment.findMany({
            include: {
                client: true,
                user: true,
            },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pagos');

        worksheet.columns = [
            // { header: 'ID', key: 'id' },
            { header: 'Cliente', key: 'clientName' },
            { header: 'Usuario', key: 'userName' },
            { header: 'Método de pago', key: 'methodPayment' },
            { header: 'Monto', key: 'amount' },
            { header: 'Descripción', key: 'description' },
            { header: 'Fecha de pago', key: 'datePay' },
            { header: 'Próxima fecha de pago', key: 'nextDatePay' },
        ];

        payments.forEach((pay) => {
            worksheet.addRow({
                id: pay.id,
                clientName: `${pay.client.name} ${pay.client.lastName}`,
                userName: `${pay.user.name} ${pay.user.lastName}`,
                methodPayment: pay.methodPayment,
                amount: pay.amount,
                description: pay.description,
                datePay: pay.datePay,
                nextDatePay: pay.nextDatePay,
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=pagos.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    }
}
