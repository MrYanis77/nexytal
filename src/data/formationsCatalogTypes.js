/**
 * Valeurs pour le paramètre d'URL `?type=` sur `/formations`.
 * @param {string | null | undefined} raw
 * @returns {'diplomantes' | 'certifiantes' | 'elearning'}
 */export function normalizeCatalogType(raw) {
  const v = (raw || '').toLowerCase().trim();
  if (v === 'certifiante' || v === 'certifiantes' || v === 'certifiant') return 'certifiantes';
  if (v === 'e-learning' || v === 'elearning' || v === 'courtes' || v === 'courte') return 'elearning';
  if (v === 'diplomantes' || v === 'diplomante' || v === 'longue') return 'diplomantes';
  return 'diplomantes';
}
