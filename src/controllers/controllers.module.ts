import { Module } from '@nestjs/common';
import { AuthenticateController } from './authenticate.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CriarCategoriaController } from './categorias/criar-categoria.controller';
import { DeletarCategoriaController } from './categorias/deletar-categoria.controller';
import { EditarCategoriaController } from './categorias/editar-categoria.controller';
import { LerCategoriasController } from './categorias/ler-categorias.controller';
import { CriarAdvogadoController } from './advogados/criar-advogado.controller';
import { EditarAdvogadoController } from './advogados/editar-advogado.controller';
import { LerAdvogadoController } from './advogados/ler-advogados.controller';
import { CriarClienteController } from './clientes/criar-cliente.controller';
import { LerClienteController } from './clientes/ler-cliente.controller';
import { EditarClienteController } from './clientes/editar-cliente.controller';
import { ProfileController } from './profile.controller';
import { LerCasosController } from './casos/ler-casos.controller';
import { CriarCasoController } from './casos/criar-caso.controller';
import { EditarCasoController } from './casos/editar-caso.controller';
import { ApagarCasoController } from './casos/deletar-caso.controller';
import { LerPagamentosController } from './pagamentos/ler-pagamentos.controller';
import { CriarPagamentoController } from './pagamentos/criar-pagamento.controller';
import { EditarPagamentoController } from './pagamentos/editar-pagamento.controller';
import { ApagarPagamentoController } from './pagamentos/deletar-pagamento.controller';

@Module({
  controllers: [
    AuthenticateController,
    ProfileController,
    DeletarCategoriaController,
    CriarCategoriaController,
    EditarCategoriaController,
    LerCategoriasController,
    CriarAdvogadoController,
    EditarAdvogadoController,
    LerAdvogadoController,
    CriarClienteController,
    LerClienteController,
    EditarClienteController,
    LerCasosController,
    CriarCasoController,
    EditarCasoController,
    ApagarCasoController,
    LerPagamentosController,
    CriarPagamentoController,
    EditarPagamentoController,
    ApagarPagamentoController,
  ],
  providers: [PrismaService],
})
export class ControllersModule {}
