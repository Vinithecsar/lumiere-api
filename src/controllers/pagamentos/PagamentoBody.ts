import { ApiProperty } from '@nestjs/swagger';

export class CriarPagamentoBody {
  @ApiProperty()
  quantia!: number;

  @ApiProperty()
  casoId!: string;
}

export class EditarPagamentoBody {
  @ApiProperty()
  quantia!: number;

  @ApiProperty()
  pago!: boolean;
}
