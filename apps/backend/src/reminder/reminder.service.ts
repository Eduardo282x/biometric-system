import { Injectable } from '@nestjs/common';
import { addDays, isSameDay } from 'date-fns';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReminderService {

    constructor(
        private prismaService: PrismaService,
        private mailService: MailService,
    ) { }

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
}
