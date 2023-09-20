import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AdvogadosModule } from './advogados/advogados.module';
import { CasosModule } from './casos/casos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AdvogadosModule, CasosModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
