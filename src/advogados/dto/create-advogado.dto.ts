import { ApiProperty } from '@nestjs/swagger';

export class CreateAdvogadoDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  senha: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty({ required: false, nullable: true })
  historico?: string;

  @ApiProperty({ required: false, nullable: true })
  areaDeAtuacao?: string;
}
