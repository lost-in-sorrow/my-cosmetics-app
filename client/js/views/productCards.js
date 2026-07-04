import { chips, emptyState, escapeHtml, productImage, productPrice } from '../ui.js';

export function renderProductGrid(products) {
  if (!products.length) return emptyState('No products found');

  return `
    <div class="catalog-grid">
      ${products
        .map((product) => {
          const image = productImage(product);
          const variants = product.product_variants || [];

          return `
            <a class="product-card" href="/products/${product.id}" data-link>
              <div class="product-image">
                ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" />` : '<span>C</span>'}
              </div>
              <div class="card-body">
                <strong>${escapeHtml(product.name)}</strong>
                <span class="price">${escapeHtml(productPrice(product))}</span>
                ${chips([`ID ${product.id}`, `${variants.length} variants`])}
              </div>
            </a>
          `;
        })
        .join('')}
    </div>
  `;
}
