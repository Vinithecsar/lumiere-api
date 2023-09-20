import { Advogado } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AdvogadoEntity implements Advogado {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  senha: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty({ required: false, nullable: true })
  historico: string | null;

  @ApiProperty({ required: false, nullable: true })
  areaDeAtuacao: string | null;
}
