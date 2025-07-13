import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule } from './clients/clients.module';
import { PaymentsModule } from './payments/payments.module';
import { MainLoadModule } from './main-load/main-load.module';
import { UsersModule } from './users/users.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [AuthModule, ClientsModule, PaymentsModule, MainLoadModule, UsersModule, PlanModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
