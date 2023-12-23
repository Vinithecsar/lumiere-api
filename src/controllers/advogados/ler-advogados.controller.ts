import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('/advogado')
@ApiTags('advogado')
export class LerAdvogadoController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handleMany(@Query() query: { search: string }) {
    const { search: nome } = query;

    const advogados = await this.prisma.usuario.findMany({
      where: {
        nome: {
          contains: nome,
          mode: 'insensitive',
        },
        isAdvogado: true,
      },
      include: {
        advogado: {
          include: {
            casos: true,
            categorias: true,
          },
        },
      },
    });

    return advogados.map((usuario) => {
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
      };
    });
  }

  @Get('/:id')
  @HttpCode(200)
  async handleUnique(@Param('id') id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id,
        isAdvogado: true,
      },
      include: {
        advogado: {
          include: {
            casos: true,
            categorias: true,
          },
        },
      },
    });

    if (!usuario) {
      return {};
    }

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
    };
  }
}
