import { PartialType } from '@nestjs/swagger';
import { CreateAdvogadoDto } from './create-advogado.dto';

export class UpdateAdvogadoDto extends PartialType(CreateAdvogadoDto) {}
