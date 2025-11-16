// Importa a biblioteca nativa
const sqlite3 = require('sqlite3').verbose();
// Importa a biblioteca para ler a entrada do console
const readline = require('readline');


// Conecta ao banco de dados que JÁ EXISTE.
const dbFile = 'banco.sqlite';
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    return console.error('Erro ao abrir o banco de dados:', err.message);
  }
  console.log(`Conectado ao banco de dados SQLite em ${dbFile}`);
  // Inicia o menu assim que a conexão for bem-sucedida
  showMenu();
});

// Cria a interface para ler e escrever no console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// --- FUNÇÕES DO MENU ---
function showMenu() {
  console.log(`
---------------------------------
 ESCOLHA UMA OPERAÇÃO NATIVA (SQL)
---------------------------------
 1. Criar nova Marca
 2. Criar novo Modelo
 3. Listar Marcas e Modelos
 4. Atualizar um Modelo
 5. Deletar um Modelo
 6. Deletar uma MARCA
 7. Sair
---------------------------------
  `);

  rl.question('Digite o número da opção: ', (choice) => {
    switch (choice) {
      case '1':
        criarMarca();
        break;
      case '2':
        criarModelo();
        break;
      case '3':
        listarMarcasEModelos();
        break;
      case '4':
        atualizarModelo();
        break;
      case '5':
        deletarModelo();
        break;
      case '6':
        deletarMarca();
        break;
      case '7':
        console.log('Fechando aplicação...');
        rl.close();
        db.close();
        break;
      default:
        console.log('Opção inválida! Tente novamente.');
        showMenu(); // Mostra o menu novamente
        break;
    }
  });
}

// Função Criar Modelo
function criarMarca() {
  rl.question('Nome da nova marca: ', (nome) => {
    rl.question('CNPJ da marca: ', (cnpj) => {
      
      const createSql = `INSERT INTO "Marca" (nome, cnpj) VALUES (?, ?)`;
      
      db.run(createSql, [nome, cnpj], function(err) {
        if (err) {
          console.error('Erro ao criar Marca:', err.message);
        } else {
          console.log(`Marca '${nome}' criada com ID: ${this.lastID}`);
        }
        showMenu(); // Volta ao menu principal
      });
    });
  });
}

// Função Criar Modelo
function criarModelo() {
  rl.question('Nome do novo modelo: ', (nome) => {
    rl.question('Tipo do modelo (ex: Hatch, SUV): ', (tipo) => {
      rl.question('ID da Marca deste modelo: ', (marcaId) => {

        const createSql = `INSERT INTO "Modelo" (nome, tipo, marcaId) VALUES (?, ?, ?)`;

        db.run(createSql, [nome, tipo, marcaId], function(err) {
          if (err) {
            console.error('Erro ao criar Modelo:', err.message);
            console.log('Verifique se o "ID da Marca" existe.');
          } else {
            console.log(`Modelo '${nome}' criado com ID: ${this.lastID}`);
          }
          showMenu(); // Volta ao menu principal
        });
      });
    });
  });
}

// Função Listar Marcas e Modelos com JOIN manual
function listarMarcasEModelos() {
  const readSql = `
    SELECT 
      ma.id as marca_id,
      ma.nome as marca_nome,
      mo.id as modelo_id,
      mo.nome as modelo_nome,
      mo.tipo as modelo_tipo
    FROM "Marca" ma
    LEFT JOIN "Modelo" mo ON ma.id = mo.marcaId
    ORDER BY ma.nome, mo.nome
  `;

  // db.all() é usado para SELECTs
  db.all(readSql, [], (err, rows) => {
    if (err) {
      return console.error('Erro ao Listar:', err.message);
    }
    
    // MANIPULAÇÃO MANUAL DO RESULTADO
    console.log("\n--- LISTA DE MARCAS E MODELOS ---");
    if (rows.length === 0) {
      console.log("Nenhum dado encontrado.");
    } else {
      let marcaAtual = "";
      rows.forEach((row) => {
        if (row.marca_nome !== marcaAtual) {
          console.log(`\nMarca: ${row.marca_nome} (ID: ${row.marca_id})`);
          marcaAtual = row.marca_nome;
        }
        if (row.modelo_id) {
          console.log(` Modelo: ${row.modelo_nome} (Tipo: ${row.modelo_tipo}, ID: ${row.modelo_id})`);
        } else {
          console.log(` (Esta marca não possui modelos cadastrados)`);
        }
      });
    }
    showMenu(); // Volta ao menu principal
  });
}

// Função Atualizar Modelo
function atualizarModelo() {
  rl.question('ID do modelo que você deseja ATUALIZAR: ', (id) => {
    rl.question('Novo nome do modelo: ', (nome) => {
      rl.question('Novo tipo do modelo: ', (tipo) => {

        const updateSql = `UPDATE "Modelo" SET nome = ?, tipo = ? WHERE id = ?`;

        db.run(updateSql, [nome, tipo, id], function(err) {
          if (err) {
            console.error('Erro no Atualizar:', err.message);
          } else if (this.changes === 0) {
            console.log(`Nenhum modelo encontrado com ID: ${id}. Nada foi atualizado.`);
          } else {
            console.log(`Modelo com ID ${id} atualizado para '${nome}' / '${tipo}'.`);
          }
          showMenu(); // Volta ao menu principal
        });
      });
    });
  });
}

// Função Deletar Modelo
function deletarModelo() {
  rl.question('ID do modelo que você deseja DELETAR: ', (id) => {
    
    const deleteSql = `DELETE FROM "Modelo" WHERE id = ?`;

    db.run(deleteSql, [id], function(err) {
      if (err) {
        console.error('Erro ao DELETAR:', err.message);
        console.log('Lembre-se: Você não pode deletar uma Marca se ela ainda tiver Modelos associados.');
      } else if (this.changes === 0) {
        console.log(`Nenhum modelo encontrado com ID: ${id}. Nada foi deletado.`);
      } else {
        console.log(`Modelo com ID ${id} foi deletado com sucesso.`);
      }
      showMenu(); // Volta ao menu principal
    });
  });
}

// Função Deletar Marca
function deletarMarca() {
  rl.question('ID da MARCA que você deseja DELETAR: ', (id) => {

    const deleteSql = `DELETE FROM "Marca" WHERE id = ?`;

    db.run(deleteSql, [id], function(err) {
      if (err) {
        console.error('Erro ao DELETAR Marca:', err.message);
        // Verifica se o erro é por causa de modelos ainda ligados a ela
        if (err.message.includes('FOREIGN KEY constraint failed')) {
          console.log('ERRO: Você não pode deletar esta marca pois ela ainda possui modelos associados.');
          console.log('Delete os modelos desta marca primeiro.');
        }
      } else if (this.changes === 0) {
        console.log(`Nenhuma marca encontrada com ID: ${id}. Nada foi deletado.`);
      } else {
        console.log(`Marca com ID ${id} foi deletada com sucesso.`);
      }
      showMenu(); // Volta ao menu principal
    });
  });
}
