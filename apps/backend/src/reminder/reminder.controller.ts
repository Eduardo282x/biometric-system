import { Controller, Get } from '@nestjs/common';
import { ReminderService } from './reminder.service';

@Controller('reminder')
export class ReminderController {

    constructor(private readonly reminderService: ReminderService) {
        
    }

    @Get('/reminders/check')
    checkReminders() {
        return this.reminderService.checkAndSendReminders();
    }

}
