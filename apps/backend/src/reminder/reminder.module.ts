import { Module } from '@nestjs/common';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ReminderController],
  providers: [ReminderService, PrismaService, MailService, ConfigService]
})
export class ReminderModule {}
