import { setStatus } from './ui.js';

async function request(path, options = {}) {
  const method = options.method || 'GET';
  setStatus('Запрос', `${method} ${path}`);

  const response = await fetch(path, {
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.error || `HTTP ${response.status}`;
    setStatus('Ошибка', message, true);
    throw new Error(message);
  }

  setStatus('Готово', `${method} ${path}`);
  return data;
}

export const api = {
  getBrands: () => request('/api/brands'),
  createBrand: (body) => request('/api/brands', { method: 'POST', body: JSON.stringify(body) }),
  updateBrand: (id, body) => request(`/api/brands/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBrand: (id) => request(`/api/brands/${id}`, { method: 'DELETE' }),

  getCategories: (page = 1, limit = 200) => request(`/api/categories?page=${page}&limit=${limit}`),
  createCategory: (body) => request('/api/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  getProducts: (page = 1, limit = 500) => request(`/api/products?page=${page}&limit=${limit}`),
  createProduct: (body) => request('/api/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  addVariant: (productId, body) => request(`/api/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(body) }),
  updateVariant: (variantId, body) => request(`/api/products/variants/${variantId}`, { method: 'PUT', body: JSON.stringify(body) }),
  finishVariant: (variantId) => request(`/api/products/variants/${variantId}/finish`, { method: 'PATCH' }),
  expireVariant: (variantId) => request(`/api/products/variants/${variantId}/expire`, { method: 'PATCH' }),
};
