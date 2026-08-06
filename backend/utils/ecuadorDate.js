const ECUADOR_TIME_ZONE = 'America/Guayaquil';

const obtenerFechaEcuador = (date = new Date()) => {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: ECUADOR_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);

    const fecha = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
    return `${fecha.year}-${fecha.month}-${fecha.day}`;
};

module.exports = { ECUADOR_TIME_ZONE, obtenerFechaEcuador };
