import { PartialType } from '@nestjs/swagger';
import { CreateCasoDto } from './create-caso.dto';

export class UpdateCasoDto extends PartialType(CreateCasoDto) {}
