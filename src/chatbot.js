const { App } = require('@slack/bolt');

const app = new App({
    signingSecret: 'TU_SIGNING_SECRET',
    token: 'TU_TOKEN',
});


app.message('Hola', async ({ message, say }) => {
    await say(`Hola <@${message.user}>! ¿En qué puedo ayudarte?`);
});

// Otros manejadores de eventos y respuestas

(async () => {
    await app.start();
    console.log('Chatbot está escuchando en el puerto 3000');
})();

