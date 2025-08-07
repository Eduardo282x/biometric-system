import { IsNotEmpty, IsString } from "class-validator";

export class UserDTO {
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    username: string;
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    name: string;
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    lastName: string;
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    role: 'GERENTE' | 'RECEPCIONISTA';
}

export class UserPasswordDTO {
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    password: string;
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    currentPassword: string;
}