import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CasosService } from './casos.service';
import { CreateCasoDto } from './dto/create-caso.dto';
import { UpdateCasoDto } from './dto/update-caso.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CasoEntity } from './entities/caso.entity';

@Controller('caso')
@ApiTags('caso')
export class CasosController {
  constructor(private readonly casosService: CasosService) {}

  @Get()
  @ApiOkResponse({ type: CasoEntity, isArray: true })
  async findMany() {
    return await this.casosService.findMany();
  }

  @Get(':id')
  @ApiOkResponse({ type: CasoEntity })
  async findOne(@Param('id') id: string) {
    return await this.casosService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: CasoEntity })
  async create(@Body() createCasoDto: CreateCasoDto) {
    return await this.casosService.create(createCasoDto);
  }

  @Put(':id')
  @ApiOkResponse({ type: CasoEntity })
  async update(@Param('id') id: string, @Body() updateCasoDto: UpdateCasoDto) {
    return await this.casosService.update(id, updateCasoDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CasoEntity })
  async remove(@Param('id') id: string) {
    return await this.casosService.remove(id);
  }
}
