const axios = require('axios');
const { App } = require('@slack/bolt');
const { handleRegistration } = require('./respuestas');

const createApp = (signingSecret, botToken) => {
    const app = new App({
        signingSecret: signingSecret,
        token: botToken,
    });

    // Opción 'hola'
    app.message('hola', async ({ message, say }) => {
        await say(`¡Hola, <@${message.user}>! ¿En qué puedo ayudarte?
    1 Registrar un mapa.
    2 Registrar una subnet.
    3 Editar un mapa.
    4 Editar una subnet.`);
    });

    app.message('register', async ({ message, say }) => {
        handleRegistration({ app, message, say });
    });
    

    return app;
};

module.exports = createApp;
