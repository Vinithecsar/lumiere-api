import { ApiProperty } from '@nestjs/swagger';

export class UpdateCasoDto {
  @ApiProperty()
  descricao: string;

  @ApiProperty()
  advogadoId: string;
}
