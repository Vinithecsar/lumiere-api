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
import { EditarCategoriaBody } from './CategoriaBody';

const editarCategoriaBodySchema = z.object({
  nome: z.string(),
});

type EditarCategoriaBodySchema = z.infer<typeof editarCategoriaBodySchema>;

@Controller('/categoria/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('categoria')
export class EditarCategoriaController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiBody({ type: EditarCategoriaBody })
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(editarCategoriaBodySchema))
    body: EditarCategoriaBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { nome } = body;
    const { sub } = user;

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: sub,
      },
    });

    if (!usuario?.isAdvogado || !usuario) {
      throw new UnauthorizedException('Criação de categoria não permitida');
    }

    const categoriaExiste = await this.prisma.categoria.findUnique({
      where: {
        id,
      },
    });

    if (!categoriaExiste) {
      throw new UnauthorizedException('Categoria não existe!');
    }

    const categoriaComMesmoNomeJaExistente =
      await this.prisma.categoria.findFirst({
        where: {
          nome,
        },
      });

    if (
      categoriaComMesmoNomeJaExistente &&
      categoriaComMesmoNomeJaExistente?.id != id
    ) {
      throw new ConflictException('Categoria com esse nome já existe.');
    }

    const categoriaAtualizada = await this.prisma.categoria.update({
      where: {
        id,
      },
      data: {
        nome,
      },
    });

    return categoriaAtualizada;
  }
}
