import { IsBoolean, IsNumber, IsString } from "class-validator";

export class ReminderBody {
    @IsString()
    name: string;
    @IsString()
    subject: string;
    @IsString()
    message: string;
    @IsNumber()
    daysBefore: number;
    @IsBoolean()
    isActive: boolean;
}
export class SendReminderBody {
    @IsString()
    reminderId: string;
    @IsNumber({}, { each: true })
    clientIds: number[];
}