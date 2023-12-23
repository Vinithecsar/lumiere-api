import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/caso/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('caso')
export class ApagarCasoController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(200)
  async handle(@Param('id') casoId: string, @CurrentUser() user: UserPayload) {
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
      usuarioLogado?.isAdvogado == false ||
      !usuarioLogado ||
      !usuarioLogado.advogado
    ) {
      throw new UnauthorizedException('Apenas advogados podem apagar casos');
    }

    const casoASerApagado = await this.prisma.caso.findUnique({
      where: {
        id: casoId,
      },
    });

    if (!casoASerApagado) {
      throw new NotFoundException('Caso não encontrado');
    }

    if (casoASerApagado.advogadoId != usuarioLogado.advogado.id) {
      throw new UnauthorizedException('Caso não pertence ao advogado logado');
    }

    const casoApagado = await this.prisma.caso.delete({
      where: {
        id: casoId,
      },
    });

    return {
      id: casoApagado.id,
      titulo: casoApagado.titulo,
      casoApagado: casoApagado.descricao,
    };
  }
}
