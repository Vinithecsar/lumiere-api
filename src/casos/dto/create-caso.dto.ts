import { ApiProperty } from '@nestjs/swagger';

export class CreateCasoDto {
  @ApiProperty()
  descricao: string;

  @ApiProperty()
  advogadoId: string;
}
