export const onlyDigits = (value) => String(value || '').replace(/\D/g, '');

export const toUpperInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().toLocaleUpperCase('es-EC');
};

export const toLowerInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().toLocaleLowerCase('es-EC');
};

export const normalizeUserPayload = (payload = {}) => ({
  ...payload,
  nombre: toUpperInput(payload.nombre),
  apellido: toUpperInput(payload.apellido),
  cedula: toUpperInput(payload.cedula),
  correo: toLowerInput(payload.correo),
  telefono: onlyDigits(payload.telefono),
  direccion: toUpperInput(payload.direccion),
  genero: toUpperInput(payload.genero),
  poseeLesion: toUpperInput(payload.poseeLesion),
  detalleLesion: payload.detalleLesion ? toUpperInput(payload.detalleLesion) : payload.detalleLesion
});
