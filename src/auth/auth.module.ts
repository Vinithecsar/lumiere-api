import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdvogadosModule } from 'src/advogados/advogados.module';
import { JwtStrategy } from './jwt.strategy';

export const jwtSecret = 'SegredoJwtDoLumiere'; // O correto é passar numa variável .env

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '10m' }, // 30s, 7d, 24h
    }),
    AdvogadosModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
