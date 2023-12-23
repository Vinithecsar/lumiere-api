import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  // Criar 2 categorias

  let id = randomUUID();
  const cat1 = await prisma.categoria.upsert({
    where: { id },
    update: {},
    create: {
      id,
      nome: 'Direito de família',
    },
  });

  id = randomUUID();
  const cat2 = await prisma.categoria.upsert({
    where: { id },
    update: {},
    create: {
      id,
      nome: 'Trânsito',
    },
  });

  // Criar 2 advogados

  id = randomUUID();
  const advogado1 = await prisma.advogado.upsert({
    where: { id },
    update: {},
    create: {
      id,
      cnpj: '75.754.249/0001-91',
      usuario: {
        create: {
          id: randomUUID(),
          nome: 'Dani Advogada',
          email: 'daniemail@email.com',
          senha_hash: await hash('123456', 6),
          isAdvogado: true,
        },
      },
      categorias: {
        connect: [{ id: cat1.id }, { id: cat2.id }],
      },
    },
  });

  id = randomUUID();
  await prisma.advogado.upsert({
    where: { id },
    update: {},
    create: {
      id,
      cnpj: '43.321.835/0001-56',
      usuario: {
        create: {
          id: randomUUID(),
          nome: 'Minora Advogado',
          email: 'minoraemail@email.com',
          senha_hash: await hash('123456', 6),
          isAdvogado: true,
        },
      },
      categorias: {
        connect: [{ id: cat1.id }, { id: cat2.id }],
      },
    },
  });

  // Criar 2 clientes

  id = randomUUID();
  const cliente1 = await prisma.cliente.upsert({
    where: { id },
    update: {},
    create: {
      id,
      usuario: {
        create: {
          id: randomUUID(),
          nome: 'George Cliente',
          email: 'georgeemail@email.com',
          senha_hash: await hash('123456', 6),
          isAdvogado: false,
        },
      },
    },
  });

  id = randomUUID();
  await prisma.cliente.upsert({
    where: { id },
    update: {},
    create: {
      id,
      usuario: {
        create: {
          id: randomUUID(),
          nome: 'Gilbert Cliente',
          email: 'gilbertemail@email.com',
          senha_hash: await hash('123456', 6),
          isAdvogado: false,
        },
      },
    },
  });

  // Criar 2 casos

  id = randomUUID();
  let pagId = randomUUID();
  await prisma.caso.upsert({
    where: { id },
    update: {},
    create: {
      id,
      titulo: 'Pensão do CR7 Júnior',
      descricao: 'Descrição da pensão do CR7 Júnior',
      clienteId: cliente1.id,
      advogadoId: advogado1.id,
      pagamento: {
        create: {
          id: pagId,
          quantia: 99.99,
          pago: true,
        },
      },
      pagamentoId: pagId,
    },
  });

  id = randomUUID();
  pagId = randomUUID();
  await prisma.caso.upsert({
    where: { id },
    update: {},
    create: {
      id,
      titulo: 'Pensão do Luva de Pedreiro',
      descricao: 'Descrição da pensão do Luva de Pedreiro',
      clienteId: cliente1.id,
      advogadoId: advogado1.id,
      pagamento: {
        create: {
          id: pagId,
          quantia: 1099.99,
          pago: false,
        },
      },
      pagamentoId: pagId,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
