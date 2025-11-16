# Trabalho Prático: Conexão Nativa (SQL Puro)

Este projeto demonstra a **Parte 2** do trabalho prático: "Conexão Nativa ('Crua')" com um banco de dados SQLite, utilizando Node.js e a biblioteca `sqlite3`.

O script `nativo.js` permite ao usuário interagir diretamente com o banco de dados através de um menu no terminal, executando comandos SQL "crus" para as operações de CRUD (Create, Read, Update, Delete).

## ⚠️ Requisitos

* **Node.js** instalado.
* **Todos os arquivos** (`nativo.js`, `banco.sql`) devem estar na mesma pasta.
* O utilitário de linha de comando **`sqlite3`** (para criar o banco inicial).

## 🚀 Como Executar

Siga estes passos na ordem correta.

### 1. Criar e Popular o Banco de Dados

Antes de rodar o script, você precisa criar o arquivo de banco de dados (`banco.sqlite`) e inserir os dados iniciais. Para isso, execute o arquivo `banco.sql`.

Abra um terminal **na pasta do projeto** e execute o seguinte comando:

```bash
sqlite3 banco.sqlite < banco.sql
