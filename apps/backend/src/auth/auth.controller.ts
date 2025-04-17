import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {

    }

    @Post()
    async authLogin(@Body() login: LoginDTO) {
        return await this.authService.authLogin(login);
    }
}
