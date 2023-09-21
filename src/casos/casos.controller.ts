import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CasosService } from './casos.service';
import { CreateCasoDto } from './dto/create-caso.dto';
import { UpdateCasoDto } from './dto/update-caso.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CasoEntity } from './entities/caso.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('')
@ApiTags('caso')
export class CasosController {
  constructor(private readonly casosService: CasosService) {}

  @Get('caso')
  @ApiOkResponse({ type: CasoEntity, isArray: true })
  async findMany() {
    return await this.casosService.findMany();
  }

  @Get('caso/:id')
  @ApiOkResponse({ type: CasoEntity })
  async findOne(@Param('id') id: string) {
    return await this.casosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('casos/me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CasoEntity, isArray: true })
  async findOwnCases(@Req() req) {
    return await this.casosService.findOwnCases(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('caso')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CasoEntity })
  async create(@Body() createCasoDto: CreateCasoDto, @Req() req) {
    return await this.casosService.create(createCasoDto, req.user.id);
  }

  @Put('caso/:id')
  @ApiOkResponse({ type: CasoEntity })
  async update(@Param('id') id: string, @Body() updateCasoDto: UpdateCasoDto) {
    return await this.casosService.update(id, updateCasoDto);
  }

  @Delete('caso/:id')
  @ApiOkResponse({ type: CasoEntity })
  async remove(@Param('id') id: string) {
    return await this.casosService.remove(id);
  }
}
