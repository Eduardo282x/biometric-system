import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDTO, PaymentFilterDTO } from './payment.dto';
import { ClientIdentificationDTO } from 'src/clients/clients.dto';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentService: PaymentsService) {

    }

    @Get()
    async getPayment() {
        const payment = await this.paymentService.getPayment();
        const history = await this.paymentService.getPaymentHistory();

        return {
            payment: payment,
            history: history
        }
    }
    @Post()
    async registerPayment(@Body() payment: PaymentDTO) {
        return await this.paymentService.registerPayment(payment);
    }
    @Post('/find')
    async getPaymentClient(@Body() client: ClientIdentificationDTO) {
        return await this.paymentService.getPaymentClient(client);
    }

    @Post('/export')
    async exportPayments(@Res() res: Response, @Body() filters: PaymentFilterDTO) {
        return await this.paymentService.exportPaymentsToExcel(res, filters);
    }
    @Put('/:id')
    async updatePayment(@Param('id') id: string, @Body() payment: PaymentDTO) {
        return await this.paymentService.updatePayment(Number(id), payment);
    }
    @Delete('/:id')
    async deletePayment(@Param('id') id: string) {
        return await this.paymentService.deletePayment(Number(id));
    }
}
