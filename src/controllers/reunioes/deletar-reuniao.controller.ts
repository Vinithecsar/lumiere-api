import {
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user-decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserPayload } from '../../auth/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('/reuniao/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('reuniao')
export class DeletarReuniaoController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @Param('id') reuniaoId: string,
    @CurrentUser() user: UserPayload,
  ) {
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
      !usuarioLogado ||
      usuarioLogado.isAdvogado == false ||
      !usuarioLogado.advogado
    ) {
      throw new UnauthorizedException(
        'Apenas advogados podem deletar reuniões',
      );
    }

    const reuniaoExiste = await this.prisma.reuniao.findUnique({
      where: {
        id: reuniaoId,
      },
      select: {
        advogadoId: true,
      },
    });

    if (!reuniaoExiste) {
      throw new ConflictException('Não existe uma reunião com esse id');
    }

    if (reuniaoExiste.advogadoId !== usuarioLogado.advogado.id) {
      throw new UnauthorizedException(
        'Não é possível deletar a reunião de um caso de outro advogado',
      );
    }

    const reuniaoApagada = await this.prisma.reuniao.delete({
      where: {
        id: reuniaoId,
      },
    });

    return reuniaoApagada;
  }
}
