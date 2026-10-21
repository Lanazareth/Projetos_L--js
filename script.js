// script.js
document.getElementById('formAgendamento').addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita recarregar a página

  // Coleta os dados digitados
  const dados = {
    nome: document.getElementById('nome').value,
    data: document.getElementById('data').value,
    horario: document.getElementById('horario').value
  };

  // Envia os dados via requisição HTTP para o backend
  try {
    const resposta = await fetch('http://localhost:3000/api/agendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      alert('Agendamento realizado com sucesso!');
    } else {
      alert('Erro ao realizar agendamento.');
    }
  } catch (erro) {
    console.error('Erro na conexão:', erro);
  }
});