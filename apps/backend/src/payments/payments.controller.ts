import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDTO } from './payment.dto';

@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentService: PaymentsService) {

    }

    @Get()
    async getPayment() {
        return await this.paymentService.getPayment();
    }
    @Get('/history')
    async getPaymentHistory() {
        return await this.paymentService.getPaymentHistory();
    }
    @Post()
    async registerPayment(@Body() payment: PaymentDTO) {
        return await this.paymentService.registerPayment(payment);
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
