import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './users.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {

    }

    @Get()
    async getUser() {
        return await this.userService.getUsers();
    }

    @Post()
    async createUser(@Body() user: UserDTO) {
        return await this.userService.createUser(user)
    }

    @Put('/:id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UserDTO) {
        return await this.userService.updateUser(id, user)
    }

    @Delete('/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.deleteUser(id)
    }
}
