import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
@ApiTags('categoria')
export class LerCategoriasController {
  constructor(private prisma: PrismaService) {}

  @Get('/categoria')
  @HttpCode(200)
  async handleMany(@Query() query: { search: string }) {
    const { search: nome } = query;

    const categorias = await this.prisma.categoria.findMany({
      where: {
        nome: {
          contains: nome,
          mode: 'insensitive',
        },
      },
    });

    return categorias;
  }

  @Get('/categoria/:id')
  @HttpCode(200)
  async handleUnique(@Param('id') id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: {
        id,
      },
    });

    return categoria;
  }
}
