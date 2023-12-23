import { Body, Controller, HttpCode, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { CurrentUser } from '../../auth/current-user-decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserPayload } from '../../auth/jwt.strategy';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { z } from 'zod';
import { EditarClienteBody } from './ClienteBody';

const editarClienteBodySchema = z.object({
  nome: z.string().optional(),
  email: z.string().email().optional(),
  senha: z.string().optional(),
});

type EditarClienteBodySchema = z.infer<typeof editarClienteBodySchema>;

@Controller('/cliente')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('cliente')
export class EditarClienteController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiBody({ type: EditarClienteBody })
  @HttpCode(200)
  async handle(
    @Body(new ZodValidationPipe(editarClienteBodySchema))
    body: EditarClienteBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { nome, email, senha } = body;
    const { sub: id } = user;

    let senha_hash: string | undefined = undefined;
    if (senha) {
      senha_hash = await hash(senha, 6);
    }

    const cliente = await this.prisma.usuario.update({
      where: {
        id,
      },
      data: {
        nome,
        email,
        senha_hash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
        isAdvogado: true,
      },
    });

    return cliente;
  }
}
