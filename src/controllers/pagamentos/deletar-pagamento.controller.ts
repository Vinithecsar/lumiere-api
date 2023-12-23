import {
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user-decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserPayload } from '../../auth/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('/pagamento/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('pagamento')
export class ApagarPagamentoController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @Param('id') pagamentoId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: id } = user;

    const usuarioLogado = await this.prisma.usuario.findUnique({
      where: {
        id,
      },
      include: {
        advogado: true,
      },
    });

    if (
      usuarioLogado?.isAdvogado == false ||
      !usuarioLogado ||
      !usuarioLogado.advogado
    ) {
      throw new UnauthorizedException(
        'Apenas advogados podem apagar pagamentos',
      );
    }

    const pagamentoExiste = await this.prisma.pagamento.findUnique({
      where: {
        id: pagamentoId,
      },
      select: {
        caso: {
          select: {
            advogadoId: true,
          },
        },
      },
    });

    if (!pagamentoExiste) {
      throw new ConflictException('Não existe um pagamento com esse id');
    }

    if (pagamentoExiste.caso.advogadoId !== usuarioLogado.advogado.id) {
      throw new UnauthorizedException(
        'Não é possível apagar o pagamento de um caso de outro advogado',
      );
    }

    const pagamentoEditado = await this.prisma.pagamento.delete({
      where: {
        id: pagamentoId,
      },
    });

    return pagamentoEditado;
  }
}
