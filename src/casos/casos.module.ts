import { Module } from '@nestjs/common';
import { CasosService } from './casos.service';
import { CasosController } from './casos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CasosController],
  providers: [CasosService],
  imports: [PrismaModule],
})
export class CasosModule {}
