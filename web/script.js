// Envia um comando ao servidor utilizando uma requisição HTTP POST
async function sendCommand(cmd) {

    // Realiza a requisição para a rota /command
    await fetch('/command', {

        // Método HTTP utilizado
        method: 'POST',

        // Define que os dados serão enviados em formato JSON
        headers: {
            'Content-Type': 'application/json'
        },

        // Corpo da requisição contendo o comando do robô
        body: JSON.stringify({

            command: cmd

        })
    });

}