import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user-decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserPayload } from '../../auth/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('reuniao')
export class LerReunioesController {
  constructor(private prisma: PrismaService) {}

  @Get('/reuniao')
  @HttpCode(200)
  async handleMany(@CurrentUser() user: UserPayload) {
    const { sub: id } = user;

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id,
      },
      include: {
        advogado: true,
        cliente: true,
      },
    });

    const reunioes = await this.prisma.reuniao.findMany({
      where: {
        OR: [
          {
            advogadoId: usuario?.advogado?.id,
          },
          {
            clienteId: usuario?.cliente?.id,
          },
        ],
      },
      include: {
        advogado: {
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
              },
            },
          },
        },
        cliente: {
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return reunioes.map((r) => {
      return {
        id: r.id,
        descricao: r.descricao,
        localizacao: r.localizacao,
        dataReuniao: r.dataReuniao,
        criadoEm: r.criadoEm,
        atualizadoEm: r.criadoEm,
        nomeAdvogado: r.advogado.usuario.nome,
        emailAdvogado: r.advogado.usuario.email,
        nomeCliente: r.cliente.usuario.nome,
        emailCliente: r.cliente.usuario.email,
        casoId: r.casoId,
      };
    });
  }

  @Get('/reuniao/:id')
  @HttpCode(200)
  async handleUnique(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: userId } = user;

    const reuniao = await this.prisma.reuniao.findUnique({
      where: {
        id,
      },
      include: {
        advogado: {
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
              },
            },
          },
        },
        cliente: {
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!reuniao) {
      throw new NotFoundException('Reunião não encontrada');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
      include: {
        advogado: true,
        cliente: true,
      },
    });

    if (
      reuniao?.advogadoId === usuario?.advogado?.id ||
      reuniao?.clienteId === usuario?.cliente?.id
    ) {
      return {
        id: reuniao.id,
        descricao: reuniao.descricao,
        localizacao: reuniao.localizacao,
        dataReuniao: reuniao.dataReuniao,
        criadoEm: reuniao.criadoEm,
        atualizadoEm: reuniao.criadoEm,
        nomeAdvogado: reuniao.advogado.usuario.nome,
        emailAdvogado: reuniao.advogado.usuario.email,
        nomeCliente: reuniao.cliente.usuario.nome,
        emailCliente: reuniao.cliente.usuario.email,
        casoId: reuniao.casoId,
      };
    } else {
      throw new UnauthorizedException(
        'Sem autorização para visualizar essa reunião',
      );
    }
  }
}
