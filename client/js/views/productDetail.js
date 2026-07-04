import { api } from '../api.js';
import {
  chips,
  compactBody,
  escapeHtml,
  formToObject,
  numberOrUndefined,
  productImage,
  productPrice,
  setPage,
  textOrUndefined,
  variantBody,
} from '../ui.js';

function findProduct(products, productId) {
  return products.find((product) => product.id === productId);
}

function renderVariantButtons(variants, selectedId) {
  return variants
    .map(
      (variant) => `
        <button class="variant-card ${variant.id === selectedId ? 'active' : ''}" data-variant-id="${variant.id}" type="button">
          <strong>${escapeHtml(variant.volume ?? 'no volume')} ml</strong>
          ${chips([`ID ${variant.id}`, variant.status || 'no status', variant.price == null ? 'no price' : `${variant.price} RUB`])}
        </button>
      `,
    )
    .join('');
}

function fillVariantForm(variant) {
  const form = document.querySelector('[data-form="variant-edit"]');
  form.elements.variant_id.value = variant.id;
  form.elements.volume.value = variant.volume ?? '';
  form.elements.price.value = variant.price ?? '';
  form.elements.status.value = variant.status || '';
  form.elements.image_url.value = variant.image_url || '';
  form.elements.features.value = variant.features ? JSON.stringify(variant.features, null, 2) : '';
}

function bindProductDetail(product) {
  const variants = product.product_variants || [];

  document.querySelectorAll('[data-variant-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const variant = variants.find((item) => item.id === Number(button.dataset.variantId));
      document.querySelectorAll('[data-variant-id]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      fillVariantForm(variant);
    });
  });

  document.querySelector('[data-form="product-edit"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.updateProduct(
      product.id,
      compactBody({
        name: textOrUndefined(fields.name),
        brand_id: numberOrUndefined(fields.brand_id),
        category_id: numberOrUndefined(fields.category_id),
        description: textOrUndefined(fields.description),
      }),
    );
    await renderProductDetailPage(product.id);
  });

  document.querySelector('[data-form="variant-edit"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.updateVariant(fields.variant_id, variantBody(fields, { partial: true }));
    await renderProductDetailPage(product.id);
  });

  document.querySelector('[data-action="variant-finish"]').addEventListener('click', async () => {
    const variantId = document.querySelector('[data-form="variant-edit"]').elements.variant_id.value;
    await api.finishVariant(variantId);
    await renderProductDetailPage(product.id);
  });

  document.querySelector('[data-action="variant-expire"]').addEventListener('click', async () => {
    const variantId = document.querySelector('[data-form="variant-edit"]').elements.variant_id.value;
    await api.expireVariant(variantId);
    await renderProductDetailPage(product.id);
  });

  document.querySelector('[data-form="variant-add"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.addVariant(product.id, variantBody(fields));
    await renderProductDetailPage(product.id);
  });

  if (variants[0]) fillVariantForm(variants[0]);
}

export async function renderProductDetailPage(productId) {
  const products = await api.getProducts();
  const product = findProduct(products, productId);

  if (!product) {
    setPage(`
      <section class="page">
        <header class="page-header">
          <div>
            <p class="kicker">Product</p>
            <h1>Product not found</h1>
          </div>
          <a class="button primary" href="/products" data-link>Go to catalog</a>
        </header>
      </section>
    `);
    return;
  }

  const variants = product.product_variants || [];
  const selectedId = variants[0]?.id;
  const image = productImage(product);

  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Product card</p>
          <h1>${escapeHtml(product.name)}</h1>
        </div>
        ${chips([`product ${product.id}`, `brand ${product.brand_id}`, `category ${product.category_id}`])}
      </header>

      <section class="detail-layout">
        <article class="panel">
          <div class="product-image">
            ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" />` : '<span>C</span>'}
          </div>
          <div class="panel-body">
            <h2>${escapeHtml(productPrice(product))}</h2>
            <p class="subtle">${escapeHtml(product.description || 'Description not set')}</p>
            <div class="variant-list">${renderVariantButtons(variants, selectedId)}</div>
          </div>
        </article>

        <div class="grid">
          <form class="panel panel-body form" data-form="product-edit">
            <h2>Edit product</h2>
            <div class="form-row">
              <label>Name <input name="name" value="${escapeHtml(product.name)}" /></label>
              <label>Brand ID <input name="brand_id" type="number" min="1" value="${product.brand_id}" /></label>
            </div>
            <label>Category ID <input name="category_id" type="number" min="1" value="${product.category_id}" /></label>
            <label>Description <textarea name="description" rows="2">${escapeHtml(product.description || '')}</textarea></label>
            <button class="button primary" type="submit">Save product</button>
          </form>

          <form class="panel panel-body form" data-form="variant-edit">
            <h2>Edit selected variant</h2>
            <input name="variant_id" type="hidden" />
            <div class="form-row">
              <label>Volume <input name="volume" type="number" step="0.01" /></label>
              <label>Price <input name="price" type="number" step="0.01" /></label>
            </div>
            <div class="form-row">
              <label>Status
                <select name="status">
                  <option value="">do not change</option>
                  <option value="new">new</option>
                  <option value="in_use">in_use</option>
                  <option value="finished">finished</option>
                  <option value="expired">expired</option>
                </select>
              </label>
              <label>Image URL <input name="image_url" type="url" /></label>
            </div>
            <label>Features JSON <textarea name="features" rows="3"></textarea></label>
            <div class="actions">
              <button class="button primary" type="submit">Save variant</button>
              <button class="button" data-action="variant-finish" type="button">finish</button>
              <button class="button danger" data-action="variant-expire" type="button">expire</button>
            </div>
          </form>

          <form class="panel panel-body form" data-form="variant-add">
            <h2>Add new variant</h2>
            <div class="form-row">
              <label>Volume <input name="volume" type="number" step="0.01" placeholder="50" /></label>
              <label>Price <input name="price" type="number" step="0.01" placeholder="1590" /></label>
            </div>
            <div class="form-row">
              <label>Status
                <select name="status" required>
                  <option value="new">new</option>
                  <option value="in_use">in_use</option>
                  <option value="finished">finished</option>
                  <option value="expired">expired</option>
                </select>
              </label>
              <label>Image URL <input name="image_url" type="url" /></label>
            </div>
            <label>Features JSON <textarea name="features" rows="3" placeholder='{"color":"black"}'></textarea></label>
            <button class="button primary" type="submit">Add variant</button>
          </form>
        </div>
      </section>
    </section>
  `);

  bindProductDetail(product);
}
