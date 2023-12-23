import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('caso')
export class LerCasosController {
  constructor(private prisma: PrismaService) {}

  @Get('/caso')
  @HttpCode(200)
  async handleMany(
    @Query() query: { search: string },
    @CurrentUser() user: UserPayload,
  ) {
    const { search: titulo } = query;
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

    const casos = await this.prisma.caso.findMany({
      where: {
        titulo: {
          contains: titulo,
          mode: 'insensitive',
        },
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
        pagamento: true,
        cliente: {
          include: {
            usuario: true,
          },
        },
        advogado: {
          include: {
            usuario: true,
          },
        },
      },
    });

    return casos.map((caso) => {
      return {
        id: caso.id,
        titulo: caso.titulo,
        descricao: caso.descricao,
        criadoEm: caso.criadoEm,
        atualizadoEm: caso.atualizadoEm,
        nomeAdvogado: caso.advogado.usuario.nome,
        emailAdvogado: caso.advogado.usuario.email,
        nomeCliente: caso.cliente.usuario.nome,
        emailCliente: caso.cliente.usuario.email,
        pagamento: caso.pagamento,
      };
    });
  }

  @Get('/caso/:id')
  @HttpCode(200)
  async handleUnique(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: userId } = user;

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
      include: {
        advogado: true,
        cliente: true,
      },
    });

    const caso = await this.prisma.caso.findUnique({
      where: {
        id,
      },
      include: {
        pagamento: true,
        cliente: {
          include: {
            usuario: true,
          },
        },
        advogado: {
          include: {
            usuario: true,
          },
        },
      },
    });

    if (!caso) {
      throw new NotFoundException('Caso não encontrado');
    }

    if (
      caso?.advogadoId === usuario?.advogado?.id ||
      caso?.clienteId === usuario?.cliente?.id
    ) {
      return {
        id: caso.id,
        titulo: caso.titulo,
        descricao: caso.descricao,
        criadoEm: caso.criadoEm,
        atualizadoEm: caso.atualizadoEm,
        nomeAdvogado: caso.advogado.usuario.nome,
        emailAdvogado: caso.advogado.usuario.email,
        nomeCliente: caso.cliente.usuario.nome,
        emailCliente: caso.cliente.usuario.email,
        pagamento: caso.pagamento,
      };
    } else {
      throw new UnauthorizedException(
        'Sem autorização para visualizar esse caso',
      );
    }
  }
}
