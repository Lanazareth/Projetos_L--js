
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORTA = 3000;

app.use(cors());
app.use(express.json());

// Abre ou cria o banco SQLite
const db = new sqlite3.Database('./sistema_agendamento.db', (erro) => {
    if (erro) {
        console.error('Erro ao abrir o banco:', erro.message);
        return;
    }

    console.log('Conectado ao SQLite!');
});

// Cria a tabela automaticamente
db.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        atendimento TEXT NOT NULL,
        data TEXT NOT NULL,
        horario TEXT NOT NULL
    )
`, (erro) => {
    if (erro) {
        console.error('Erro ao criar a tabela:', erro.message);
        return;
    }

    console.log('Tabela agendamentos pronta!');

    app.listen(PORTA, () => {
        console.log(`Servidor rodando em http://localhost:${PORTA}`);
    });
});

// Recebe os dados do formulário
app.post('/api/agendar', (req, res) => {
    const { nome, atendimento, data, horario } = req.body;

    if (!nome || !atendimento || !data || !horario) {
        return res.status(400).json({
            erro: 'Preencha todos os campos.'
        });
    }

    const sql = `
        INSERT INTO agendamentos (nome, atendimento, data, horario)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [nome, atendimento, data, horario], function (erro) {
        if (erro) {
            console.error('Erro ao salvar agendamento:', erro.message);

            return res.status(500).json({
                erro: 'Erro ao salvar agendamento no SQLite.'
            });
        }

        res.status(201).json({
            mensagem: 'Agendamento realizado com sucesso!',
            id: this.lastID
        });
    });
});
