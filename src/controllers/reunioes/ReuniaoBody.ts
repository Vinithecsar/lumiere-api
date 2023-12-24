import { ApiProperty } from '@nestjs/swagger';

export class CriarReuniaoBody {
  @ApiProperty()
  descricao!: string;

  @ApiProperty()
  localizacao!: string;

  @ApiProperty()
  dataReuniao!: Date;

  @ApiProperty()
  emailCliente!: string;

  @ApiProperty()
  casoId!: string;
}

export class EditarReuniaoBody {
  @ApiProperty()
  descricao!: string;

  @ApiProperty()
  localizacao!: string;

  @ApiProperty()
  dataReuniao!: Date;
}
