//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async loginAdvogado(email: string, senha: string): Promise<AuthEntity> {
    // Procura advofado com o email dado
    const user = await this.prisma.advogado.findUnique({
      where: { email: email },
    });

    // Se não encontrar, retorna um erro
    if (!user) {
      throw new NotFoundException(
        `Advogado não encontrado para o email: ${email}`,
      );
    }

    // Checar se a senha está correta
    const senhaValida = await compare(senha, user.senha);

    // Se inválida, retorna um erro
    if (!senhaValida) {
      throw new UnauthorizedException('Senha inválida');
    }

    // Gera um JWT contendo o Id do Advogado e retorna
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
