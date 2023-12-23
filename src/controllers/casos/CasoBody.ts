import { ApiProperty } from '@nestjs/swagger';

export class CriarCasoBody {
  @ApiProperty()
  titulo!: string;

  @ApiProperty()
  descricao!: string;

  @ApiProperty()
  emailCliente!: string;
}

export class EditarCasoBody {
  @ApiProperty()
  titulo!: string;

  @ApiProperty()
  descricao!: string;
}
