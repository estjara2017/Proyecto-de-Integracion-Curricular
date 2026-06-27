const ACRONYM_WORDS = new Set(['EC', 'USA', 'QR', 'OTP', 'RUC', 'CI']);

export const toPascalCaseText = (value) => {
  if (value === null || value === undefined) return '';

  return String(value)
    .trim()
    .toLocaleLowerCase('es-EC')
    .replace(/\s+/g, ' ')
    .replace(/(^|[\s'/-])([\p{L}\p{N}])/gu, (_, separator, letter) => (
      `${separator}${letter.toLocaleUpperCase('es-EC')}`
    ))
    .split(' ')
    .map((word) => (ACRONYM_WORDS.has(word.toLocaleUpperCase('es-EC')) ? word.toLocaleUpperCase('es-EC') : word))
    .join(' ');
};

export const formatFullName = (...parts) => (
  toPascalCaseText(parts.filter(Boolean).join(' '))
);
