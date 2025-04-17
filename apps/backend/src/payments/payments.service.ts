import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDTO } from './payment.dto';

@Injectable()
export class PaymentsService {


    constructor(private readonly prismaService: PrismaService) {

    }

    async getPayment() {
        return await this.prismaService.payments.findMany();
    }

    async registerPayment(payment: PaymentDTO) {
        try {
            await this.prismaService.payments.create({
                data: {
                    clientId: payment.clientId,
                    methodPayment: payment.methodPayment,
                    status: payment.status,
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
            await this.prismaService.payments.update({
                data: {
                    clientId: payment.clientId,
                    methodPayment: payment.methodPayment,
                    status: payment.status,
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
            await this.prismaService.payments.delete({
                where: { id }
            })

            baseResponse.message = 'Pago eliminado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
