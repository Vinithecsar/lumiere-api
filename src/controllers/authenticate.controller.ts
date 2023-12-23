import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  senha: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

class AuthenticateBody {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  senha!: string;
}

@Controller('auth')
@ApiTags('auth')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post('loginAdvogado')
  @ApiBody({ type: AuthenticateBody })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handleAdvogado(@Body() body: AuthenticateBodySchema) {
    const { email, senha } = body;

    const user = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Credenciais de usuário não correspondem!',
      );
    }

    const isPasswordValid = await compare(senha, user.senha_hash);

    if (!isPasswordValid || !user.isAdvogado) {
      throw new UnauthorizedException(
        'Credenciais de usuário não correspondem!',
      );
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }

  @Post('loginCliente')
  @ApiBody({ type: AuthenticateBody })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handleCliente(@Body() body: AuthenticateBodySchema) {
    const { email, senha } = body;

    const user = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Credenciais de usuário não correspondem!',
      );
    }

    const isPasswordValid = await compare(senha, user.senha_hash);

    if (!isPasswordValid || user.isAdvogado) {
      throw new UnauthorizedException(
        'Credenciais de usuário não correspondem!',
      );
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
