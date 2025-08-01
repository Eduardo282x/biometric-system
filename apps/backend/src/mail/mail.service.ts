import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        const email = this.configService.get<string>('GMAIL_USER');
        const password = this.configService.get<string>('GMAIL_PASS');

        if (!email || !password) {
            throw new Error('Las credenciales de correo no están configuradas correctamente.');
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password,
            }
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        try {
            const info = await this.transporter.sendMail({
                from: `Sistema de Recordatorios`,
                to,
                subject,
                text,
            });
            console.log('Correo enviado:', info.messageId);
            return 'Correo enviado'
        } catch (error) {
            console.error('Error al enviar correo:', error);
        }
    }

}
