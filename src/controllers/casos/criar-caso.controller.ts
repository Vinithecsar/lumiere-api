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
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { CriarCasoBody } from './CasoBody';

const criarCasoBodySchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  emailCliente: z.string().email(),
});

type CriarCasoBodySchema = z.infer<typeof criarCasoBodySchema>;

@Controller('/caso')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('caso')
export class CriarCasoController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: CriarCasoBody })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(criarCasoBodySchema))
    body: CriarCasoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { titulo, descricao, emailCliente } = body;
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
      throw new UnauthorizedException('Apenas advogados podem criar casos');
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
      throw new NotFoundException('Cliente não encontrado');
    }

    const casoCriado = await this.prisma.caso.create({
      data: {
        titulo,
        descricao,
        advogadoId: usuarioLogado.advogado?.id,
        clienteId: usuarioCliente.cliente.id,
      },
    });

    return {
      id: casoCriado.id,
      titulo,
      descricao,
      criadoEm: casoCriado.criadoEm,
      atualizadoEm: casoCriado.atualizadoEm,
      nomeAdvogado: usuarioLogado.nome,
      emailAdvogado: usuarioLogado.email,
      nomeCliente: usuarioCliente.nome,
      emailCliente: usuarioCliente.email,
    };
  }
}
