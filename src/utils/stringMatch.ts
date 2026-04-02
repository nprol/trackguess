/**
 * Normaliza un string para comparaciones de adivinanza.
 * Elimina: mayúsculas, acentos, puntuación, contenido entre paréntesis/corchetes,
 * "feat.", "ft.", "featuring", artículos iniciales comunes, espacios extra.
 */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    // Elimina contenido entre paréntesis y corchetes (remixes, feat, versiones)
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    // Elimina feat./ft./featuring
    .replace(/\bfeat\.?\b|\bft\.?\b|\bfeaturing\b/g, '')
    // Normaliza acentos (NFD descompone, luego elimina diacríticos)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Elimina puntuación (excepto apóstrofes en contracciones)
    .replace(/[^\w\s']/g, '')
    // Colapsa espacios
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compara la respuesta del usuario con el valor correcto.
 * Retorna true si hay coincidencia suficiente (exacta tras normalización).
 */
export function isCorrectAnswer(userInput: string, correct: string): boolean {
  const u = normalizeAnswer(userInput);
  const c = normalizeAnswer(correct);

  if (!u || !c) return false;
  if (u === c) return true;

  // Tolerancia: el usuario escribió al menos el 80% correcto (para títulos muy largos)
  // Sólo si ambos tienen más de 5 chars para evitar falsos positivos
  if (u.length > 5 && c.length > 5) {
    if (c.startsWith(u) || u.startsWith(c)) return true;
  }

  return false;
}

/**
 * Para dificultad "hard": compara título Y artista.
 * El usuario puede separarlos con " - ", " by ", coma, etc.
 */
export function isCorrectHardAnswer(
  userInput: string,
  title: string,
  artists: string[],
): boolean {
  const u = normalizeAnswer(userInput);
  const t = normalizeAnswer(title);
  const mainArtist = normalizeAnswer(artists[0] ?? '');

  // Acepta "Título - Artista" o "Artista - Título" o "Título, Artista"
  const combined1 = `${t} ${mainArtist}`;
  const combined2 = `${mainArtist} ${t}`;

  return u === combined1 || u === combined2 || u.includes(t) && u.includes(mainArtist);
}
