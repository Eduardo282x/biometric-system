import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderBody, SendReminderBody } from './reminder.dto';

@Controller('reminder')
export class ReminderController {

    constructor(private readonly reminderService: ReminderService) {

    }

    @Get()
    async getReminder() {
        return await this.reminderService.getReminder();
    }
    @Get('/history')
    async getHistory() {
        return await this.reminderService.getHistoryReminder();
    }
    @Get('/reminders/check')
    checkReminders() {
        return this.reminderService.checkAndSendReminders();
    }
    @Post()
    async createReminder(@Body() body: ReminderBody) {
        return await this.reminderService.createReminder(body);
    }
    @Post('/send')
    async sendRemindersToClients(@Body() body: SendReminderBody) {
        return await this.reminderService.sendRemindersToClients(body.reminderId, body.clientIds);
    }
    @Put('/:id')
    async updateReminder(@Param('id') id: string, @Body() body: ReminderBody) {
        return await this.reminderService.updateReminder(id, body);
    }
    @Delete('/:id')
    async deleteReminder(@Param('id') id: string) {
        return await this.reminderService.deleteReminder(id);
    }
}
