import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { EditarCasoBody } from './CasoBody';

const editarCasoBodySchema = z.object({
  titulo: z.string().optional(),
  descricao: z.string().optional(),
});

type EditarCasoBodySchema = z.infer<typeof editarCasoBodySchema>;

@Controller('/caso/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('caso')
export class EditarCasoController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiBody({ type: EditarCasoBody })
  @HttpCode(201)
  async handle(
    @Param('id') casoId: string,
    @Body(new ZodValidationPipe(editarCasoBodySchema))
    body: EditarCasoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { titulo, descricao } = body;
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
      throw new UnauthorizedException('Apenas advogados podem editar casos');
    }

    const casoASerEditado = await this.prisma.caso.findUnique({
      where: {
        id: casoId,
      },
    });

    if (!casoASerEditado) {
      throw new NotFoundException('Caso não encontrado');
    }

    if (casoASerEditado.advogadoId != usuarioLogado.advogado.id) {
      throw new UnauthorizedException('Caso não pertence ao advogado logado');
    }

    const cliente = await this.prisma.cliente.findUnique({
      where: {
        id: casoASerEditado.clienteId,
      },
      include: {
        usuario: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const casoAtualizado = await this.prisma.caso.update({
      where: {
        id: casoId,
      },
      data: {
        titulo,
        descricao,
      },
    });

    return {
      id: casoAtualizado.id,
      titulo,
      descricao,
      criadoEm: casoAtualizado.criadoEm,
      atualizadoEm: casoAtualizado.atualizadoEm,
      nomeAdvogado: usuarioLogado.nome,
      emailAdvogado: usuarioLogado.email,
      nomeCliente: cliente.usuario.nome,
      emailCliente: cliente.usuario.email,
    };
  }
}
