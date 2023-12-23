import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CriarAdvogadoBody {
  @ApiProperty()
  nome!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  senha!: string;

  @ApiProperty()
  cnpj!: string;

  @ApiProperty({ required: false, nullable: true })
  historico!: string;

  @ApiProperty({ required: false, nullable: true })
  areaDeAtuacao!: string;

  @ApiProperty({ required: false, nullable: true, isArray: true })
  categoriasIds!: string;
}

export class EditarAdvogadoBody extends PartialType(CriarAdvogadoBody) {}
