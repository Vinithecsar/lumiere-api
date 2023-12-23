import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { z } from 'zod';
import { CriarClienteBody } from './ClienteBody';

const criarClienteBodySchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  senha: z.string(),
});

type CriarClienteBodySchema = z.infer<typeof criarClienteBodySchema>;

@Controller('/cliente')
@ApiTags('cliente')
export class CriarClienteController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: CriarClienteBody })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(criarClienteBodySchema))
    body: CriarClienteBodySchema,
  ) {
    const { nome, email, senha } = body;

    const clienteComMesmoEmail = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (clienteComMesmoEmail) {
      throw new ConflictException(
        'Já existe um usuário com esse e-mail cadastrado',
      );
    }

    const senha_hash = await hash(senha, 6);

    const clienteCriado = await this.prisma.cliente.create({
      data: {
        usuario: {
          create: {
            nome,
            email,
            senha_hash,
            isAdvogado: false,
          },
        },
      },
    });

    return {
      id: clienteCriado.usuarioId,
      nome,
      email,
      isAdvogado: false,
    };
  }
}
