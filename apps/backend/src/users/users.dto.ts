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
    role: 'ADMIN' | 'GERENTE' | 'RECEPCIONISTA';
}