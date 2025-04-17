import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDTO } from './clients.dto';

@Controller('clients')
export class ClientsController {

    constructor(private readonly clientService: ClientsService) {

    }

    @Get()
    async getClients() {
        return await this.clientService.getClients();
    }
    @Post()
    async registerClients(@Body() client: ClientDTO) {
        return await this.clientService.registerClients(client);
    }
    @Put('/:id')
    async updateClients(@Param('id') id: string, @Body() client: ClientDTO) {
        return await this.clientService.updateClients(Number(id), client);
    }
    @Delete('/:id')
    async deleteClients(@Param('id') id: string) {
        return await this.clientService.deleteClients(Number(id));
    }
}
