-- Parte 1: Script de Criação das Tabelas

-- Cria a tabela Marca
CREATE TABLE "Marca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL UNIQUE
);

-- Cria a tabela Modelo
CREATE TABLE "Modelo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL, -- Ex: 'Sedan', 'Hatch', 'SUV'
    "marcaId" INTEGER NOT NULL,
    CONSTRAINT "Modelo_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);


-- Parte 2: Inserção de Dados de Exemplo

-- Inserir Marcas
INSERT INTO "Marca" (nome, cnpj) VALUES ('Volkswagen', '12.345.678/0001-01');
INSERT INTO "Marca" (nome, cnpj) VALUES ('Fiat', '12.345.678/0001-02');

-- Inserir Modelos
INSERT INTO "Modelo" (nome, tipo, marcaId) VALUES ('Gol', 'Hatch', 1);
INSERT INTO "Modelo" (nome, tipo, marcaId) VALUES ('Polo', 'Hatch', 1);
INSERT INTO "Modelo" (nome, tipo, marcaId) VALUES ('Argo', 'Hatch', 2);
INSERT INTO "Modelo" (nome, tipo, marcaId) VALUES ('Toro', 'Pickup', 2);
