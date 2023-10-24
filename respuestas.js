// respuestas.js
const registrationData = {};
let currentState = 'start';

const registrationQuestions = {
    start: {
        question: 'Ingresa la dirección MAC:',
        property: 'MAC',
        validator: (answer) => answer.length === 17,
        errorMessage: 'Dirección MAC incorrecta. Debe tener 17 caracteres.',
        successMessage: 'Dirección MAC registrada correctamente.',
        nextState: 'hostname',
    },
    hostname: {
        question: 'Ingresa el hostname:',
        property: 'hostname',
        validator: (answer) => answer.length > 0,
        errorMessage: 'Error en el hostname.',
        successMessage: 'Hostname registrado correctamente.',
        nextState: 'serial',
    },
    serial: {
        question: 'Ingresa el serial:',
        property: 'serial',
        validator: (answer) => !isNaN(answer),
        errorMessage: 'Error en el serial.',
        successMessage: 'Serial registrado correctamente.',
        nextState: 'finish',
    },
    finish: {
        finalMessage: '¡Registrado Exitosamente!',
        finalValidator: () => true,
        finalSuccessMessage: '¡Registrado Exitosamente!',
    }
};

module.exports = {
    registrationData,
    registrationQuestions,
    currentState,
};
