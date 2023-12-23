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
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('pagamento')
export class LerPagamentosController {
  constructor(private prisma: PrismaService) {}

  @Get('/pagamento')
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

    const pagamentos = await this.prisma.pagamento.findMany({
      where: {
        OR: [
          {
            caso: {
              advogadoId: usuario?.advogado?.id,
            },
          },
          {
            caso: {
              clienteId: usuario?.cliente?.id,
            },
          },
        ],
      },
    });

    return pagamentos;
  }

  @Get('/pagamento/:id')
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

    const pagamento = await this.prisma.pagamento.findUnique({
      where: {
        id,
      },
      include: {
        caso: {
          select: {
            advogadoId: true,
            clienteId: true,
          },
        },
      },
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    if (
      pagamento?.caso.advogadoId === usuario?.advogado?.id ||
      pagamento?.caso.clienteId === usuario?.cliente?.id
    ) {
      return pagamento;
    } else {
      throw new UnauthorizedException(
        'Sem autorização para visualizar esse pagamento',
      );
    }
  }
}
