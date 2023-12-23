import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
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
import { CriarCategoriaBody } from './CategoriaBody';

const criarCategoriaBodySchema = z.object({
  nome: z.string(),
});

type CriarCategoriaBodySchema = z.infer<typeof criarCategoriaBodySchema>;

@Controller('/categoria')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('categoria')
export class CriarCategoriaController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: CriarCategoriaBody })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(criarCategoriaBodySchema))
    body: CriarCategoriaBodySchema,
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

    const categoriaJaExistente = await this.prisma.categoria.findUnique({
      where: {
        nome,
      },
    });

    if (categoriaJaExistente) {
      throw new ConflictException('Categoria com esse nome já existe.');
    }

    const categoriaCriada = await this.prisma.categoria.create({
      data: {
        nome,
      },
    });

    return categoriaCriada;
  }
}
