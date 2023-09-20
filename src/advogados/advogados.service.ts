import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdvogadoDto } from './dto/create-advogado.dto';
import { UpdateAdvogadoDto } from './dto/update-advogado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class AdvogadosService {
  constructor(private prisma: PrismaService) {}

  async findManyByName(data) {
    return await this.prisma.advogado.findMany({
      where: {
        nome: {
          contains: data.nome,
          mode: 'insensitive',
        },
      },
      select: {
        nome: true,
        email: true,
        cnpj: true,
        historico: true,
        areaDeAtuacao: true,
      },
    });
  }

  async findOne(id: string) {
    const advogado = await this.prisma.advogado.findUnique({
      where: {
        id,
      },
    });

    if (!advogado) {
      return { error: `Advogado de id "${id}" não encontrado` };
    }

    return advogado;
  }

  async create(createAdvogadoDto: CreateAdvogadoDto) {
    const advogadoComMesmoEmail = await this.prisma.advogado.findUnique({
      where: {
        email: createAdvogadoDto.email,
      },
    });

    if (advogadoComMesmoEmail) {
      throw new NotFoundException(
        'Já existe um advogado com esse e-mail cadastrado',
      );
    }

    const advogadoComMesmoCNPJ = await this.prisma.advogado.findUnique({
      where: {
        cnpj: createAdvogadoDto.cnpj,
      },
    });

    if (advogadoComMesmoCNPJ) {
      throw new NotFoundException(
        'Já existe um advogado com esse CNPJ cadastrado',
      );
    }

    const password_hash = await hash(createAdvogadoDto.senha, 6);

    return await this.prisma.advogado.create({
      data: {
        nome: createAdvogadoDto.nome,
        email: createAdvogadoDto.email,
        senha: password_hash,
        cnpj: createAdvogadoDto.cnpj,
        historico: createAdvogadoDto.historico,
        areaDeAtuacao: createAdvogadoDto.areaDeAtuacao,
      },
    });
  }

  async update(id: string, updateAdvogadoDto: UpdateAdvogadoDto) {
    return await this.prisma.advogado.update({
      where: {
        id,
      },
      data: updateAdvogadoDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.advogado.delete({
      where: {
        id,
      },
    });
  }
}
