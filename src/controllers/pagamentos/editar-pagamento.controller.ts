import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user-decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserPayload } from '../../auth/jwt.strategy';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { z } from 'zod';
import { EditarPagamentoBody } from './PagamentoBody';

const editarPagamentoBodySchema = z.object({
  quantia: z.number().optional(),
  pago: z.boolean().optional(),
});

type EditarPagamentoBodySchema = z.infer<typeof editarPagamentoBodySchema>;

@Controller('/pagamento/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('pagamento')
export class EditarPagamentoController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiBody({ type: EditarPagamentoBody })
  @HttpCode(200)
  async handle(
    @Param('id') pagamentoId: string,
    @Body(new ZodValidationPipe(editarPagamentoBodySchema))
    body: EditarPagamentoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { quantia, pago } = body;
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
      !usuarioLogado ||
      usuarioLogado.isAdvogado == false ||
      !usuarioLogado.advogado
    ) {
      throw new UnauthorizedException(
        'Apenas advogados podem editar pagamentos',
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
        'Não é possível editar o pagamento de um caso de outro advogado',
      );
    }

    const pagamentoEditado = await this.prisma.pagamento.update({
      where: {
        id: pagamentoId,
      },
      data: {
        quantia,
        pago,
      },
    });

    return pagamentoEditado;
  }
}
