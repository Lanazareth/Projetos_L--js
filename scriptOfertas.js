
const formulario = document.getElementById('formOfertas');
const mensagem = document.getElementById('mensagemOfertas');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dados = {
        nome: document.getElementById('nomeCliente').value.trim(),
        whatsapp: document.getElementById('whatsappCliente').value.trim()
    };

    mensagem.textContent = 'Enviando cadastro...';

    try {
        const resposta = await fetch('http://localhost:3000/api/ofertas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = resultado.erro || 'Não foi possível cadastrar.';
            return;
        }

        mensagem.textContent = resultado.mensagem;
        formulario.reset();

    } catch (erro) {
        console.error('Erro de conexão:', erro);
        mensagem.textContent =
            'Não foi possível conectar ao servidor. Verifique se ele está rodando na porta 3000.';
    }
});
