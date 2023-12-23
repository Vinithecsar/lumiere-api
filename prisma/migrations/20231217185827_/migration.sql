-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "isAdvogado" BOOLEAN NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advogados" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "historico" TEXT,
    "areaDeAtuacao" TEXT,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "advogados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "quantia" DOUBLE PRECISION NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3),
    "casoId" TEXT NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "casos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "advogadoId" TEXT NOT NULL,
    "pagamentoId" TEXT,

    CONSTRAINT "casos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdvogadoToCategoria" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_usuarioId_key" ON "clientes"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "advogados_cnpj_key" ON "advogados"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "advogados_usuarioId_key" ON "advogados"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_casoId_key" ON "pagamentos"("casoId");

-- CreateIndex
CREATE UNIQUE INDEX "casos_pagamentoId_key" ON "casos"("pagamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "_AdvogadoToCategoria_AB_unique" ON "_AdvogadoToCategoria"("A", "B");

-- CreateIndex
CREATE INDEX "_AdvogadoToCategoria_B_index" ON "_AdvogadoToCategoria"("B");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advogados" ADD CONSTRAINT "advogados_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "casos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "casos" ADD CONSTRAINT "casos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "casos" ADD CONSTRAINT "casos_advogadoId_fkey" FOREIGN KEY ("advogadoId") REFERENCES "advogados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdvogadoToCategoria" ADD CONSTRAINT "_AdvogadoToCategoria_A_fkey" FOREIGN KEY ("A") REFERENCES "advogados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdvogadoToCategoria" ADD CONSTRAINT "_AdvogadoToCategoria_B_fkey" FOREIGN KEY ("B") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
