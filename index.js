// index.js
const { App } = require('@slack/bolt');
let { registrationData, registrationQuestions, currentState } = require('./respuestas');
const machina = require('machina')

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

// Estados de la conversación de registro
const registrationStates = {
    WAITING_MAC_ADDRESS: 'waitingMacAddress',
    WAITING_HOSTNAME: 'waitingHostname',
    WAITING_SERIAL: 'waitingSerial',
};

// Estados de la conversación de actualización
const updateStates = {
    WAITING_MAC_ADDRESS: 'waitingMacAddress',
    WAITING_HOSTNAME: 'waitingHostname',
    WAITING_SERIAL: 'waitingSerial',
};

// Usuarios actuales en las conversaciones de registro
const registrationUsers = new Map();

// Usuarios actuales en las conversaciones de actualización
const updateUsers = new Map();

// Usuarios actuales en conversaciones de limpieza
const clearUsers = new Map();

// Manejar el comando "hola" solo si no se está en medio de una conversación
app.message('hola', async ({ message, say }) => {
    const userId = message.user;
    if (!registrationUsers.has(userId) && !updateUsers.has(userId)) {
        await say(`¡Hola! Aquí están las opciones disponibles:\n1. Para registrar, escriba "registrar".\n2. Para actualizar, escriba "actualizar".`);
    }
});

// Manejar el flujo de conversación para registro
app.message(async ({ message, say }) => {
    const userMessage = message.text;
    const userId = message.user;
    const registrationUserData = registrationUsers.get(userId);
    const updateUserData = updateUsers.get(userId);

    if (registrationUserData) {
        switch (registrationUserData.state) {
            case registrationStates.WAITING_MAC_ADDRESS:
                registrationUserData.data.macAddress = userMessage;
                registrationUserData.state = registrationStates.WAITING_HOSTNAME;
                await say('Ingrese el hostname para registrar.');
                break;
            case registrationStates.WAITING_HOSTNAME:
                registrationUserData.data.hostname = userMessage;
                registrationUserData.state = registrationStates.WAITING_SERIAL;
                await say('Ingrese el serial para registrar.');
                break;
            case registrationStates.WAITING_SERIAL:
                registrationUserData.data.serial = userMessage;
                await say('Muestra resultados');
                await say('¡Registrado Exitosamente!');
                await say(`Datos:\nMAC Address: ${registrationUserData.data.macAddress}\nHostname: ${registrationUserData.data.hostname}\nSerial: ${registrationUserData.data.serial}`);
                registrationUsers.delete(userId); // Reiniciar la conversación de registro
                break;
        }
    } else if (updateUserData) {
        switch (updateUserData.state) {
            case updateStates.WAITING_MAC_ADDRESS:
                updateUserData.data.macAddress = userMessage;
                updateUserData.state = updateStates.WAITING_HOSTNAME;
                await say('Ingrese el nuevo hostname para actualizar.');
                break;
            case updateStates.WAITING_HOSTNAME:
                updateUserData.data.hostname = userMessage;
                updateUserData.state = updateStates.WAITING_SERIAL;
                await say('Ingrese el nuevo serial para actualizar.');
                break;
            case updateStates.WAITING_SERIAL:
                updateUserData.data.serial = userMessage;
                await say('Muestra resultados de la actualización');
                await say('¡Actualizado Exitosamente!');
                await say(`Datos Actualizados:\nMAC Address: ${updateUserData.data.macAddress}\nNuevo Hostname: ${updateUserData.data.hostname}\nNuevo Serial: ${updateUserData.data.serial}`);
                updateUsers.delete(userId); // Reiniciar la conversación de actualización
                break;
        }
    }
});

// Manejar el comando "registrar" para iniciar la conversación de registro
app.message('registrar', async ({ message, say }) => {
    const userId = message.user;
    if (!registrationUsers.has(userId)) {
        registrationUsers.set(userId, {
            state: registrationStates.WAITING_MAC_ADDRESS,
            data: {
                macAddress: '',
                hostname: '',
                serial: '',
            },
        });
        await say('Ingrese la MAC Address para registrar.');
    }
});

// Manejar el comando "actualizar" para iniciar la conversación de actualización
app.message('actualizar', async ({ message, say }) => {
    const userId = message.user;
    if (!updateUsers.has(userId)) {
        updateUsers.set(userId, {
            state: updateStates.WAITING_MAC_ADDRESS,
            data: {
                macAddress: '',
                hostname: '',
                serial: '',
            },
        });
        await say('Ingrese la MAC Address para actualizar.');
    }
});

(async () => {
    await app.start(process.env.PORT || 12000);
    console.log('⚡️ Bolt app is running!');
})();
