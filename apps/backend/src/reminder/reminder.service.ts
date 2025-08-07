import { Injectable } from '@nestjs/common';
import { addDays, isSameDay } from 'date-fns';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReminderBody } from './reminder.dto';
import { badResponse, baseResponse } from 'src/base/base.interface';

@Injectable()
export class ReminderService {

    constructor(
        private prismaService: PrismaService,
        private mailService: MailService,
    ) { }


    async getReminder() {
        return await this.prismaService.reminder.findMany()
    }

    async getHistoryReminder() {
        return await this.prismaService.reminderHistory.findMany({
            include: { client: true, reminder: true }
        })
    }

    async createReminder(data: ReminderBody) {
        try {
            await this.prismaService.reminder.create({ data });
            baseResponse.message = 'Recordatorio creado exitosamente.'
            return baseResponse
        } catch (err) {

            badResponse.message = `Error al crear el recordatorio ${err}`
            return badResponse;
        }
    }

    async updateReminder(id: string, data: ReminderBody) {
        try {
            await this.prismaService.reminder.update({
                where: { id },
                data,
            });
            baseResponse.message = 'Recordatorio actualizado.'
            return baseResponse
        } catch (err) {
            badResponse.message = `Error al actualizar el recordatorio ${err}`
            return badResponse;
        }
    }

    async deleteReminder(id: string) {
        try {
            await this.prismaService.reminder.delete({
                where: { id },
            });
            baseResponse.message = 'Recordatorio eliminado.'
            return baseResponse
        } catch (err) {
            badResponse.message = `Error al eliminar el recordatorio ${err}`
            return badResponse;
        }
    }

    async checkAndSendReminders() {
        // const reminders = await this.prismaService.reminder.findMany({
        //     where: { isActive: true },
        //     include: { client: true },
        // });
        const reminders = []
        const today = new Date();

        for (const reminder of reminders) {
            const client = reminder.client;
            if (!client || !client.email || !client.nextPay) continue;

            const reminderDate = addDays(client.nextPay, -reminder.daysBefore);

            if (isSameDay(reminderDate, today)) {
                await this.mailService.sendMail(
                    client.email,
                    reminder.subject,
                    reminder.message,
                );
            }
        }
    }

    async sendRemindersToClients(reminderId: string, clientIds: number[]) {
        try {
            // Obtener el recordatorio
            const reminder = await this.prismaService.reminder.findUnique({
                where: { id: reminderId }
            });
            if (!reminder) {
                return { success: false, message: 'Recordatorio no encontrado.' };
            }

            // Obtener los clientes
            const clients = await this.prismaService.client.findMany({
                where: { id: { in: clientIds } }
            });
            // Obtener todos los pagos de los clientes seleccionados, ordenados por fecha descendente
            const payments = await this.prismaService.payment.findMany({
                where: { clientId: { in: clientIds } },
                orderBy: { datePay: 'desc' }
            });

            // Mapear el último pago de cada cliente
            const latestPaymentsByClient: { [key: number]: any } = {};
            payments.forEach(payment => {
                if (!latestPaymentsByClient[payment.clientId]) {
                    latestPaymentsByClient[payment.clientId] = payment;
                }
            });

            let sentCount = 0;
            for (const client of clients) {
                if (!client.email) continue;

                // Buscar el último pago de este cliente
                const lastPayment = latestPaymentsByClient[client.id];
                let mensajeFinal = '';
                if (lastPayment && lastPayment.nextDatePay) {
                    const hoy = new Date();
                    const fechaPago = new Date(lastPayment.nextDatePay);
                    hoy.setHours(0, 0, 0, 0);
                    fechaPago.setHours(0, 0, 0, 0);
                    const dias = Math.ceil((fechaPago.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                    if (dias > 0) {
                        mensajeFinal = `\n\nSu suscripción vencerá en ${dias} días.`;
                    } else {
                        mensajeFinal = `\n\nSu suscripción ya se encuentra vencida.`;
                    }
                } else {
                    mensajeFinal = `\n\nNo se encontró información de pago reciente.`;
                }

                // Enviar el correo con el mensaje personalizado
                await this.mailService.sendMail(
                    client.email,
                    reminder.subject,
                    reminder.message + mensajeFinal
                );

                // Guardar en el historial
                await this.prismaService.reminderHistory.create({
                    data: {
                        clientId: client.id,
                        reminderId: reminder.id,
                    }
                });

                sentCount++;
            }

            return {
                success: true,
                message: `Se enviaron ${sentCount} recordatorios y se guardaron en el historial.`
            };
        } catch (err) {
            return {
                success: false,
                message: `Error al enviar recordatorios: ${err.message}`
            };
        }
    }
}
