import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
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
import { CriarPagamentoBody } from './PagamentoBody';

const criarPagamentoBodySchema = z.object({
  quantia: z.number(),
  casoId: z.string().uuid(),
});

type CriarPagamentoBodySchema = z.infer<typeof criarPagamentoBodySchema>;

@Controller('/pagamento')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('pagamento')
export class CriarPagamentoController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: CriarPagamentoBody })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(criarPagamentoBodySchema))
    body: CriarPagamentoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { quantia, casoId } = body;
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
        'Apenas advogados podem criar pagamentos',
      );
    }

    const caso = await this.prisma.caso.findUnique({
      where: {
        id: casoId,
      },
    });

    if (!caso) {
      throw new NotFoundException('Caso não encontrado');
    }

    if (caso.advogadoId !== usuarioLogado.advogado.id) {
      throw new UnauthorizedException(
        'Não é possível criar pagamentos para um caso de outro advogado',
      );
    }

    const pagamentoJaExiste = await this.prisma.pagamento.findUnique({
      where: {
        casoId,
      },
    });

    if (pagamentoJaExiste) {
      throw new ConflictException('Já existe um pagamento para esse caso');
    }

    const pagamento = await this.prisma.pagamento.create({
      data: {
        quantia,
        casoId,
      },
    });

    return pagamento;
  }
}
