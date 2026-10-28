
document.getElementById('formAgendamento').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Coleta os dados do formulário
    const dados = {
        nome: document.getElementById('nome').value.trim(),
        atendimento: document.getElementById('atendimento').value,
        data: document.getElementById('data').value,
        horario: document.getElementById('horario').value
    };

    // Envia os dados para o backend
    try {
        const resposta = await fetch('http://localhost:3000/api/agendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Agendamento realizado com sucesso!');
            document.getElementById('formAgendamento').reset();
        } else {
            alert(resultado.erro || 'Erro ao realizar agendamento.');
            console.error('Erro retornado pelo backend:', resultado);
        }

    } catch (erro) {
        console.error('Erro na conexão com o backend:', erro);
        alert('Não foi possível conectar ao servidor. Verifique se ele está funcionando.');
    }
});
