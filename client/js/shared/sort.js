function firstCharacter(value) {
  return String(value || '').trim().charAt(0);
}

export function getSortGroup(value) {
  const first = firstCharacter(value);
  if (!first) return { bucket: 0, key: '#' };
  if (/\d/.test(first)) return { bucket: 1, key: '#' };
  if (/[A-Za-z]/.test(first)) return { bucket: 2, key: first.toUpperCase() };
  if (/[А-Яа-яЁё]/.test(first)) return { bucket: 3, key: first.toUpperCase() };
  return { bucket: 0, key: '#' };
}

export function compareCatalogNames(a, b) {
  const aGroup = getSortGroup(a);
  const bGroup = getSortGroup(b);
  const bucketDiff = aGroup.bucket - bGroup.bucket;
  if (bucketDiff) return bucketDiff;
  return String(a || '').localeCompare(String(b || ''), ['en', 'ru'], { numeric: true, sensitivity: 'base' });
}

export function compareAlphabetItems(a, b) {
  if (a === '#') return b === '#' ? 0 : -1;
  if (b === '#') return 1;
  const aLatin = /^[A-Z]$/.test(a);
  const bLatin = /^[A-Z]$/.test(b);
  if (aLatin !== bLatin) return aLatin ? -1 : 1;
  return a.localeCompare(b, ['en', 'ru'], { sensitivity: 'base' });
}

export function getAlphabetItems(items, getValue = (item) => item?.name ?? item) {
  return [...new Set(items.map((item) => getSortGroup(getValue(item)).key))].sort(compareAlphabetItems);
}
