import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCasoDto } from './dto/create-caso.dto';
import { UpdateCasoDto } from './dto/update-caso.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CasosService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return await this.prisma.caso.findMany({});
  }

  async findOwnCases(id: string) {
    return await this.prisma.caso.findMany({
      where: {
        advogadoId: id,
      },
    });
  }

  async findOne(id: string) {
    const caso = await this.prisma.caso.findUnique({
      where: {
        id,
      },
    });

    if (!caso) {
      throw new NotFoundException(`Caso de id "${id}" não encontrado`);
    }

    return caso;
  }

  async create(createCasoDto: CreateCasoDto, id: string) {
    return await this.prisma.caso.create({
      data: {
        descricao: createCasoDto.descricao,
        advogadoId: id,
      },
    });
  }

  async update(id: string, updateCasoDto: UpdateCasoDto) {
    return await this.prisma.caso.update({
      where: {
        id,
      },
      data: { descricao: updateCasoDto.descricao },
    });
  }

  async remove(id: string) {
    return await this.prisma.caso.delete({
      where: {
        id,
      },
    });
  }
}
