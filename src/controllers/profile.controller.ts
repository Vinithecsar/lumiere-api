import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user-decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPayload } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Controller('/profile')
@ApiTags('profile/me')
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  @Get('/me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async handleProfile(@CurrentUser() user: UserPayload) {
    const { sub: id } = user;

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id,
      },
      include: {
        advogado: {
          include: {
            categorias: true,
            casos: true,
            reunioes: true,
          },
        },
        cliente: {
          include: {
            casos: true,
            reunioes: true,
          },
        },
      },
    });

    if (!usuario) {
      return {};
    }

    if (usuario.isAdvogado) {
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        criadoEm: usuario.criadoEm,
        cnpj: usuario.advogado?.cnpj,
        historico: usuario.advogado?.historico,
        areaDeAtuacao: usuario.advogado?.areaDeAtuacao,
        casos: usuario.advogado?.casos,
        categorias: usuario.advogado?.categorias,
        reunioes: usuario.advogado?.reunioes,
      };
    } else {
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        criadoEm: usuario.criadoEm,
        isAdvogado: false,
        casos: usuario.cliente?.casos,
        reunioes: usuario.cliente?.reunioes,
      };
    }
  }
}
