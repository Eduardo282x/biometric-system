import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";

export class PaymentDTO {
    @IsNumber()
    clientId: number;
    @IsNumber()
    userId: number;
    @IsString()
    methodPayment: string;
    @IsNumber()
    amount: number;
    @IsString()
    description: string;
    @Transform(({ value }) => new Date(value))
    @IsDate()
    nextDatePay: Date;
}