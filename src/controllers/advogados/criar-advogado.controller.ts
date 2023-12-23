import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { CriarAdvogadoBody } from './AdvogadoBody';

const criarAdvogadoBodySchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  senha: z.string(),
  cnpj: z.string(),
  historico: z.string().optional().nullable(),
  areaDeAtuacao: z.string().optional().nullable(),
  categoriasIds: z.string().array().optional().nullable(),
});

type CriarAdvogadoBodySchema = z.infer<typeof criarAdvogadoBodySchema>;

@Controller('/advogado')
@ApiTags('advogado')
export class CriarAdvogadoController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: CriarAdvogadoBody })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(criarAdvogadoBodySchema))
    body: CriarAdvogadoBodySchema,
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

    const advogadoComMesmoEmail = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (advogadoComMesmoEmail) {
      throw new ConflictException(
        'Já existe um usuário com esse e-mail cadastrado',
      );
    }

    const advogadoComMesmoCnpj = await this.prisma.advogado.findUnique({
      where: {
        cnpj,
      },
    });

    if (advogadoComMesmoCnpj) {
      throw new ConflictException(
        'Já existe um advogado com esse CNPJ cadastrado',
      );
    }

    const senha_hash = await hash(senha, 6);

    const arrayDeCategorias = categoriasIds?.map((cat: string) => ({
      id: cat,
    }));

    const advogadoCriado = await this.prisma.advogado.create({
      data: {
        cnpj,
        historico,
        areaDeAtuacao,
        usuario: {
          create: {
            nome,
            email,
            senha_hash,
            isAdvogado: true,
          },
        },
        categorias: {
          connect: arrayDeCategorias,
        },
      },
    });

    return {
      id: advogadoCriado.id,
      nome,
      email,
      cnpj,
      historico,
      areaDeAtuacao,
    };
  }
}
