import { IsEmail, IsEmpty, IsPhoneNumber, IsString } from "class-validator";

export class ClientDTO {
    @IsString()
    name: string;
    @IsString()
    lastName: string;
    @IsString()
    @IsPhoneNumber('VE', { message: 'Numero de telefono invalido.' })
    phone: string;
    @IsString()
    address: string;
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    identify: string;
}
export class ClientIdentificationDTO {
    @IsString()
    identify: string;
}