import { Caso } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CasoEntity implements Caso {
  @ApiProperty()
  id: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  advogadoId: string;
}
