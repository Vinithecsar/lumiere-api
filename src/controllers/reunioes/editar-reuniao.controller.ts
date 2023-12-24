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
import { EditarReuniaoBody } from './ReuniaoBody';

const editarReuniaoBodySchema = z.object({
  descricao: z.string().optional(),
  localizacao: z.string().optional(),
  dataReuniao: z.date().optional(),
});

type EditarReuniaoBodySchema = z.infer<typeof editarReuniaoBodySchema>;

@Controller('/reuniao/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('reuniao')
export class EditarReuniaoController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiBody({ type: EditarReuniaoBody })
  @HttpCode(200)
  async handle(
    @Param('id') reuniaoId: string,
    @Body(new ZodValidationPipe(editarReuniaoBodySchema))
    body: EditarReuniaoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { descricao, localizacao, dataReuniao } = body;
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
      throw new UnauthorizedException('Apenas advogados podem editar reuniões');
    }

    const reuniaoExiste = await this.prisma.reuniao.findUnique({
      where: {
        id: reuniaoId,
      },
      select: {
        advogadoId: true,
      },
    });

    if (!reuniaoExiste) {
      throw new ConflictException('Não existe uma reunião com esse id');
    }

    if (reuniaoExiste.advogadoId !== usuarioLogado.advogado.id) {
      throw new UnauthorizedException(
        'Não é possível editar a reunião de um caso de outro advogado',
      );
    }

    const reuniaoEditada = await this.prisma.reuniao.update({
      where: {
        id: reuniaoId,
      },
      data: {
        descricao,
        localizacao,
        dataReuniao,
      },
    });

    return reuniaoEditada;
  }
}
