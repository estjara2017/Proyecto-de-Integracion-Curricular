const KG_PER_LB = 0.45359237;

const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1;
    return edad;
};

const obtenerRangoEdad = (edad) => {
    if (edad === null || edad === undefined) return 'Sin rango';
    if (edad >= 12 && edad < 18) return '12-18';
    if (edad >= 18 && edad < 30) return '18-30';
    if (edad >= 30 && edad < 50) return '30-50';
    return '50+';
};

const calcularPesoTeoricoMaxKg = (usuario, nivel) => {
    const pesoCorporal = Number(usuario.peso || 0);
    const estatura = Number(usuario.estatura || 0);
    const baseNivelKg = Number(nivel?.pesoMaximoBaseLb || 95) * KG_PER_LB;

    if (!pesoCorporal || !estatura) return Math.round(baseNivelKg);

    const generoFactor = String(usuario.genero || '').toLowerCase().includes('fem') ? 0.82 : 1;
    const alturaFactor = Math.min(Math.max(estatura / 1.7, 0.82), 1.16);
    const nivelFactor = {
        Principiante: 0.8,
        Novato: 0.95,
        Intermedio: 1.15,
        Avanzado: 1.32,
        Elite: 1.48
    }[nivel?.nombre || usuario.nivel] || 1;

    const estimadoEstructura = pesoCorporal * generoFactor * alturaFactor * nivelFactor;
    const limitePorNivel = baseNivelKg * 1.1;

    return Math.round(Math.min(estimadoEstructura, limitePorNivel));
};

const calcularPorcentajeProgreso = (usuario, nivel) => {
    const pesoMaxPromedio = Number(usuario.pesoMaxPromedioKg || 0);
    const pesoTeoricoMaxKg = calcularPesoTeoricoMaxKg(usuario, nivel);
    const porcentaje = pesoTeoricoMaxKg > 0
        ? Math.min(Math.round((pesoMaxPromedio / pesoTeoricoMaxKg) * 100), 100)
        : 0;

    return { pesoTeoricoMaxKg, porcentajeProgreso: porcentaje };
};

const calcularSemanaCiclo = (ciclos = 4) => {
    const inicio = new Date(Date.UTC(2026, 0, 5));
    const hoy = new Date();
    const hoyUtc = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const diffDias = Math.floor((hoyUtc - inicio.getTime()) / 86400000);
    const semana = Math.max(Math.floor(diffDias / 7), 0);
    return (semana % ciclos) + 1;
};

module.exports = {
    calcularEdad,
    obtenerRangoEdad,
    calcularPesoTeoricoMaxKg,
    calcularPorcentajeProgreso,
    calcularSemanaCiclo
};
