import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CriarCategoriaBody {
  @ApiProperty()
  nome!: string;
}

export class EditarCategoriaBody extends PartialType(CriarCategoriaBody) {}
