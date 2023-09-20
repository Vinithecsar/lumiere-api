import { Module } from '@nestjs/common';
import { AdvogadosService } from './advogados.service';
import { AdvogadosController } from './advogados.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AdvogadosController],
  providers: [AdvogadosService],
  imports: [PrismaModule],
  exports: [AdvogadosService],
})
export class AdvogadosModule {}
