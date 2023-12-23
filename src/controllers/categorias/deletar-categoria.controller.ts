import {
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/categoria/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('categoria')
export class DeletarCategoriaController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(200)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const { sub } = user;

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: sub,
      },
    });

    if (!usuario?.isAdvogado || !usuario) {
      throw new UnauthorizedException('Criação de categoria não permitida');
    }

    return await this.prisma.categoria.delete({
      where: {
        id,
      },
    });
  }
}
