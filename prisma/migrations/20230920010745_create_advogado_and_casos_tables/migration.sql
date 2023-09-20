-- CreateTable
CREATE TABLE "Advogado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "historico" TEXT,
    "areaDeAtuacao" TEXT,

    CONSTRAINT "Advogado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caso" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "advogadoId" TEXT NOT NULL,

    CONSTRAINT "Caso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Advogado_email_key" ON "Advogado"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Advogado_cnpj_key" ON "Advogado"("cnpj");

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_advogadoId_fkey" FOREIGN KEY ("advogadoId") REFERENCES "Advogado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
