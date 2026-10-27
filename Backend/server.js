
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORTA = 3000;

app.use(cors());
app.use(express.json());

// Abre o banco na mesma pasta deste arquivo server.js
const caminhoBanco = path.join(__dirname, 'sistema_agendamento.db');

console.log('Banco SQLite utilizado:', caminhoBanco);

const db = new sqlite3.Database(caminhoBanco, (erro) => {
    if (erro) {
        console.error('Erro ao abrir o banco:', erro.message);
    } else {
        console.log('Conectado ao SQLite!');
    }
});

// Cria as tabelas antes de iniciar o servidor
db.serialize(() => {
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
            console.error('Erro ao criar agendamentos:', erro.message);
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS clientes_ofertas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `, (erro) => {
        if (erro) {
            console.error('Erro ao criar clientes_ofertas:', erro.message);
            return;
        }

        console.log('Tabelas do banco preparadas!');

        const servidor = app.listen(PORTA, () => {
            console.log(`Servidor rodando em http://localhost:${PORTA}`);
        });

        servidor.on('error', (erroServidor) => {
            console.error('Erro ao iniciar o servidor:', erroServidor.message);
        });
    });
});

// Rota para testar o servidor
app.get('/api/status', (req, res) => {
    res.json({ mensagem: 'Servidor funcionando!' });
});

// Rota para consultar os cadastros de ofertas
app.get('/api/ofertas', (req, res) => {
    db.all(
        'SELECT * FROM clientes_ofertas ORDER BY id DESC',
        [],
        (erro, linhas) => {
            if (erro) {
                console.error('Erro ao consultar ofertas:', erro.message);
                return res.status(500).json({
                    erro: 'Não foi possível consultar os cadastros.'
                });
            }

            res.json(linhas);
        }
    );
});

// Rota para cadastrar agendamentos
app.post('/api/agendar', (req, res) => {
    const { nome, atendimento, data, horario } = req.body;

    if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof atendimento !== 'string' || !atendimento.trim() ||
        typeof data !== 'string' || !data.trim() ||
        typeof horario !== 'string' || !horario.trim()
    ) {
        return res.status(400).json({
            erro: 'Preencha todos os campos do agendamento.'
        });
    }

    const sql = `
        INSERT INTO agendamentos (nome, atendimento, data, horario)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nome.trim(), atendimento.trim(), data, horario],
        function (erro) {
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
        }
    );
});

// Rota para cadastrar clientes interessados nas ofertas
app.post('/api/ofertas', (req, res) => {
    const { nome, whatsapp } = req.body;

    if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof whatsapp !== 'string' || !whatsapp.trim()
    ) {
        return res.status(400).json({
            erro: 'Informe seu nome e WhatsApp.'
        });
    }

    const sql = `
        INSERT INTO clientes_ofertas (nome, whatsapp)
        VALUES (?, ?)
    `;

    db.run(sql, [nome.trim(), whatsapp.trim()], function (erro) {
        if (erro) {
            console.error('Erro ao salvar cliente das ofertas:', erro.message);
            return res.status(500).json({
                erro: 'Erro ao salvar o cadastro no SQLite.'
            });
        }

        console.log('Cliente de ofertas salvo. ID:', this.lastID);

        res.status(201).json({
            mensagem: 'Cadastro de ofertas realizado com sucesso!',
            id: this.lastID
        });
    });
});
