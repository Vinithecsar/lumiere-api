import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/cliente')
@ApiTags('cliente')
export class LerClienteController {
  constructor(private prisma: PrismaService) {}

  @Get('/:id')
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const cliente = await this.prisma.usuario.findUnique({
      where: {
        id,
        isAdvogado: false,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
        isAdvogado: true,
      },
    });

    if (!cliente) {
      return {};
    }

    return cliente;
  }
}
