import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PlanDTO {
    @IsString()
    @IsNotEmpty({message: 'Este campo es requerido.'})
    name: string;
    @IsNumber()
    @IsNotEmpty({message: 'Este campo es requerido.'})
    price: number;
    @IsString()
    @IsNotEmpty({message: 'Este campo es requerido.'})
    description: string;
}