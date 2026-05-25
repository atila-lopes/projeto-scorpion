async function sendCommand(cmd) {

    await fetch('/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            command: cmd
        })
    });

}