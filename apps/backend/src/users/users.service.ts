import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO, UserPasswordDTO } from './users.dto';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async getUsers() {
        return await this.prismaService.user.findMany({
            orderBy: { id: 'asc' }
        });
    }

    async createUser(newUser: UserDTO) {
        try {
            await this.prismaService.user.create({
                data: {
                    username: newUser.username,
                    name: newUser.name,
                    lastName: newUser.lastName,
                    password: '1234',
                    role: newUser.role,
                }
            });
            baseResponse.message = 'Usuario creado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async updateUserPassword(id: number, newUser: UserPasswordDTO) {
        try {
            const findUserPassword = await this.prismaService.user.findFirst({
                where: {password: newUser.currentPassword}
            });

            if(!findUserPassword){
                badResponse.message = 'La contraseña actual no coincide'
                return badResponse;
            }

            await this.prismaService.user.update({
                data: {
                    password: newUser.password,
                },
                where: { id }
            });
            baseResponse.message = 'Contraseña actualizada.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async updateUser(id: number, newUser: UserDTO) {
        try {
            const userUpdated = await this.prismaService.user.update({
                data: {
                    username: newUser.username,
                    name: newUser.name,
                    lastName: newUser.lastName,
                    role: newUser.role,
                },
                where: { id }
            });
            baseResponse.data = userUpdated;
            baseResponse.message = 'Usuario actualizado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async deleteUser(id: number) {
        try {
            await this.prismaService.user.delete({
                where: { id }
            });
            baseResponse.message = 'Usuario eliminado exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
