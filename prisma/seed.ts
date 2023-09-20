import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cria 3 advogados
  await prisma.advogado.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      nome: 'Pedro Advogado',
      email: 'pedroemails@gmail.com',
      senha: '123456',
      cnpj: '36.533.571/0001-39',
    },
  });

  await prisma.advogado.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      nome: 'Raquel Advogada',
      email: 'raquelemails@gmail.com',
      senha: '654321',
      cnpj: '65.829.007/0001-66',
    },
  });

  await prisma.advogado.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      nome: 'Elizia Advogada',
      email: 'eliziaemails@gmail.com',
      senha: '123654',
      cnpj: '19.611.575/0001-79',
    },
  });

  // Cria dois casos pro advogado de id 1

  await prisma.caso.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      descricao: 'Pensão do CR7 Júnior',
      advogadoId: '1',
    },
  });

  await prisma.caso.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      descricao: 'Pensão do Luva de Pedreiro',
      advogadoId: '1',
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
