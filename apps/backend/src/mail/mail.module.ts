import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';

@Module({
  providers: [MailService, ConfigService],
  exports: [MailService],
  controllers: [MailController]
})
export class MailModule {}
