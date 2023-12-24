-- CreateTable
CREATE TABLE "reunioes" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "dataReuniao" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "advogadoId" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,

    CONSTRAINT "reunioes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_advogadoId_fkey" FOREIGN KEY ("advogadoId") REFERENCES "advogados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "casos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
