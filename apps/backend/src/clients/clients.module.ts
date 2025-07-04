import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FaceService } from './face.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, FaceService, PrismaService]
})
export class ClientsModule { }
