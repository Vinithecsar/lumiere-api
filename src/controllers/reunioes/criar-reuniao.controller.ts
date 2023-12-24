import {
  Body,
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
import { CriarReuniaoBody } from './ReuniaoBody';

const criarReuniaoBodySchema = z.object({
  descricao: z.string(),
  localizacao: z.string(),
  dataReuniao: z.coerce.date(),
  emailCliente: z.string().email(),
  casoId: z.string().uuid(),
});

type CriarReuniaoBodySchema = z.infer<typeof criarReuniaoBodySchema>;

@Controller('/reuniao')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('reuniao')
export class CriarReuniaoController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: CriarReuniaoBody })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(criarReuniaoBodySchema))
    body: CriarReuniaoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { descricao, localizacao, dataReuniao, emailCliente, casoId } = body;
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
      throw new UnauthorizedException('Apenas advogados podem criar reuniões');
    }

    const usuarioCliente = await this.prisma.usuario.findUnique({
      where: {
        email: emailCliente,
      },
      include: {
        cliente: true,
      },
    });

    if (!usuarioCliente || !usuarioCliente.cliente) {
      throw new NotFoundException('Cliente com esse email não encontrado');
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
        'Não é possível criar reuniões para um caso de outro advogado',
      );
    }

    const reuniao = await this.prisma.reuniao.create({
      data: {
        descricao,
        localizacao,
        dataReuniao,
        clienteId: usuarioCliente.cliente.id,
        advogadoId: usuarioLogado.advogado.id,
        casoId,
      },
    });

    return {
      id: reuniao.id,
      descricao: reuniao.descricao,
      localizacao: reuniao.localizacao,
      dataReuniao: reuniao.dataReuniao,
      criadoEm: reuniao.criadoEm,
      atualizadoEm: reuniao.criadoEm,
      nomeAdvogado: usuarioLogado.nome,
      emailAdvogado: usuarioLogado.email,
      nomeCliente: usuarioCliente.nome,
      emailCliente: usuarioLogado.email,
    };
  }
}
