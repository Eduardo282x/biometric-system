import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class ClientDTO {
    @IsString()
    name: string;
    @IsString()
    lastName: string;
    @IsString()
    @IsPhoneNumber('VE')
    phone: string;
    @IsString()
    photo: string;
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    identify: string;
}