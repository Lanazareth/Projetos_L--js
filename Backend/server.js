JavaScript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha_aqui', 
  database: 'sistema_agendamento'
});


db.connect((erro) => {
  if (erro) {
    console.error('Erro ao conectar ao banco de dados:', erro);
    return;
  }
  console.log('Conectado com sucesso ao banco de dados MySQL!');
});


app.post('/api/agendar', (req, res) => {
  const { nome, atendimento, data, horario } = req.body;

 
  const query = 'INSERT INTO agendamentos (nome, atendimento, data, horario) VALUES (?, ?, ?, ?)';

  db.query(query, [nome, atendimento, data, horario], (err, result) => {
    if (err) {
      console.error('Erro ao guardar os dados:', err);
      return res.status(500).json({ erro: 'Erro interno na base de dados' });
    }
    
    res.status(200).json({ mensagem: 'Agendamento guardado com sucesso!' });
  });
});


app.listen(3000, () => {
  console.log('Servidor Backend a correr na porta 3000 (http://localhost:3000)');
});