import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CriarClienteBody {
  @ApiProperty()
  nome!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  senha!: string;
}

export class EditarClienteBody extends PartialType(CriarClienteBody) {}
