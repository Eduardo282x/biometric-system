import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {

    constructor(private readonly mailService: MailService) {
        
    }

    @Post()
    async testSendEmail() {
        return await this.mailService.sendMail('eduardorojas282x@gmail.com', 'Prueba de envio', 'Estoy enviando un correo de prueba para probar el sistema')
    }
}
