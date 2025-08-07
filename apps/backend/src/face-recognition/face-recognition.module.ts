import { Module } from '@nestjs/common';
import { FaceRecognitionController } from './face-recognition.controller';
import { FaceRecognitionService } from './face-recognition.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FaceRecognitionController],
  providers: [FaceRecognitionService, PrismaService],
  exports:[FaceRecognitionService]
})
export class FaceRecognitionModule {}
