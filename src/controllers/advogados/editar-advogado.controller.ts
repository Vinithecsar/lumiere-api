import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { EditarAdvogadoBody } from './AdvogadoBody';

const editarAdvogadoBodySchema = z.object({
  nome: z.string().optional(),
  email: z.string().email().optional(),
  senha: z.string().optional(),
  cnpj: z.string().optional(),
  historico: z.string().optional().nullable(),
  areaDeAtuacao: z.string().optional().nullable(),
  categoriasIds: z.string().array().optional().nullable(),
});

type EditarAdvogadoBodySchema = z.infer<typeof editarAdvogadoBodySchema>;

@Controller('/advogado')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('advogado')
export class EditarAdvogadoController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiBody({ type: EditarAdvogadoBody })
  @HttpCode(200)
  async handle(
    @Body(new ZodValidationPipe(editarAdvogadoBodySchema))
    body: EditarAdvogadoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      nome,
      email,
      senha,
      cnpj,
      historico,
      areaDeAtuacao,
      categoriasIds,
    } = body;

    const { sub: userId } = user;

    const findUsuario = await this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUsuario) {
      throw new NotFoundException('Advogado não encontrado no sistema');
    }

    if (findUsuario.isAdvogado === false) {
      throw new UnauthorizedException('Usuário não é advogado');
    }

    let senha_hash: string | undefined = undefined;
    if (senha) {
      senha_hash = await hash(senha, 6);
    }
    const usuario = await this.prisma.usuario.update({
      where: {
        id: userId,
      },
      data: {
        nome,
        email,
        senha_hash,
      },
      include: {
        advogado: true,
      },
    });

    if (cnpj || historico || areaDeAtuacao || categoriasIds) {
      const advogado = await this.prisma.advogado.findUnique({
        where: {
          id: usuario.advogado!.id,
        },
        select: {
          id: true,
          categorias: true,
        },
      });

      const arrayDeCategoriasNovas = categoriasIds?.map((cat: string) => ({
        id: cat,
      }));

      await this.prisma.advogado.update({
        where: {
          id: advogado?.id,
        },
        data: {
          cnpj,
          historico,
          areaDeAtuacao,
          categorias: {
            set: [],
            connect: arrayDeCategoriasNovas,
          },
        },
      });
    }
  }
}
