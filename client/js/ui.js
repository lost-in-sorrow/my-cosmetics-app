const app = document.querySelector('#app');
const statusDot = document.querySelector('#statusDot');
const statusTitle = document.querySelector('#statusTitle');
const statusText = document.querySelector('#statusText');

export function setPage(html) {
  app.innerHTML = html;
}

export function setStatus(title, text, isError = false) {
  statusTitle.textContent = title;
  statusText.textContent = text;
  statusDot.classList.toggle('error', isError);
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function emptyState(text) {
  return `<div class="empty">${escapeHtml(text)}</div>`;
}

export function chips(items) {
  return `<div class="meta">${items.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')}</div>`;
}

export function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function numberOrNull(value) {
  return value === '' || value == null ? null : Number(value);
}

export function numberOrUndefined(value) {
  return value === '' || value == null ? undefined : Number(value);
}

export function textOrNull(value) {
  const trimmed = String(value || '').trim();
  return trimmed ? trimmed : null;
}

export function textOrUndefined(value) {
  const trimmed = String(value || '').trim();
  return trimmed ? trimmed : undefined;
}

export function parseJsonOrNull(value) {
  const trimmed = String(value || '').trim();
  return trimmed ? JSON.parse(trimmed) : null;
}

export function compactBody(body) {
  return Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined));
}

export function variantBody(fields, { partial = false } = {}) {
  return compactBody({
    volume: partial ? numberOrUndefined(fields.volume) : numberOrNull(fields.volume),
    price: partial ? numberOrUndefined(fields.price) : numberOrNull(fields.price),
    image_url: partial ? textOrUndefined(fields.image_url) : textOrNull(fields.image_url),
    features: fields.features ? parseJsonOrNull(fields.features) : partial ? undefined : null,
    status: textOrUndefined(fields.status),
  });
}

export function productImage(product) {
  return product.product_variants?.find((variant) => variant.image_url)?.image_url || '';
}

export function productPrice(product) {
  const prices = (product.product_variants || [])
    .map((variant) => variant.price)
    .filter((price) => typeof price === 'number');

  if (!prices.length) return 'Цена не указана';
  return `от ${Math.min(...prices)} RUB`;
}

export function activateNav(pathname) {
  document.querySelectorAll('.nav a[data-link]').forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    const isActive = linkPath === '/' ? pathname === '/' : pathname.startsWith(linkPath);
    link.classList.toggle('active', isActive);
  });
}
