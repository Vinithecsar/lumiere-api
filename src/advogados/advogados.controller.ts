import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdvogadosService } from './advogados.service';
import { CreateAdvogadoDto } from './dto/create-advogado.dto';
import { UpdateAdvogadoDto } from './dto/update-advogado.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdvogadoEntity } from './entities/advogado.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
@ApiTags('advogado')
export class AdvogadosController {
  constructor(private readonly advogadosService: AdvogadosService) {}

  @Get('advogado')
  @ApiOkResponse({ type: AdvogadoEntity, isArray: true })
  async findManyByName(@Query() query: { search: string }) {
    return await this.advogadosService.findManyByName({ nome: query.search });
  }

  @Get('advogado/:id')
  @ApiOkResponse({ type: AdvogadoEntity })
  async findOne(@Param('id') id: string) {
    return await this.advogadosService.findOne(id);
  }

  @Post('advogado')
  @ApiCreatedResponse({ type: AdvogadoEntity })
  async create(@Body() createAdvogadoDto: CreateAdvogadoDto) {
    return await this.advogadosService.create(createAdvogadoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('advogado/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AdvogadoEntity })
  async update(
    @Param('id') id: string,
    @Body() updateAdvogadoDto: UpdateAdvogadoDto,
  ) {
    return await this.advogadosService.update(id, updateAdvogadoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('advogado/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AdvogadoEntity })
  async remove(@Param('id') id: string) {
    return await this.advogadosService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('proifle/me')
  @ApiBearerAuth()
  @ApiOkResponse()
  async getTokenFromHeaders(@Req() req) {
    return await this.advogadosService.findOne(req.user.id);
  }
}
