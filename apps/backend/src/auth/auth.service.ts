import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse, BaseResponseLogin } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO } from './auth.dto';

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async authLogin(login: LoginDTO) {
        try {
            const findUser = await this.prismaService.users.findFirst({
                where: {
                    username: login.username,
                    password: login.password
                }
            })

            if (!findUser) {
                badResponse.message = 'Usuario no encontrado.'
                return badResponse;
            }

            const responseLogin: BaseResponseLogin = {
                message: `Bienvenido ${findUser.name} ${findUser.lastName}`,
                success: true,
                userData: findUser
            }

            return responseLogin;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
