import { api } from '../api.js';
import { chips, escapeHtml, formToObject, numberOrNull, parseJsonOrNull, setPage, textOrNull } from '../ui.js';
import { renderProductGrid } from './productCards.js';

function bindCreateProduct(brandId) {
  document.querySelector('[data-form="product-create"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);

    await api.createProduct({
      name: fields.name,
      brand_id: brandId,
      category_id: Number(fields.category_id),
      description: textOrNull(fields.description),
      volume: numberOrNull(fields.volume),
      price: numberOrNull(fields.price),
      image_url: textOrNull(fields.image_url),
      features: fields.features ? parseJsonOrNull(fields.features) : null,
      status: fields.status,
    });

    await renderBrandProductsPage(brandId);
  });
}

export async function renderBrandProductsPage(brandId) {
  const [brands, products] = await Promise.all([api.getBrands(), api.getProducts()]);
  const brand = brands.find((item) => item.id === brandId);
  const brandProducts = products.filter((product) => product.brand_id === brandId);

  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Каталог бренда</p>
          <h1>${escapeHtml(brand ? brand.name : `Бренд #${brandId}`)}</h1>
        </div>
        ${chips([`${brandProducts.length} продуктов`, `бренд ${brandId}`])}
      </header>

      <section class="panel panel-body">
        <h2>Создать продукт для этого бренда</h2>
        <p class="subtle">Продукт создается вместе с первым вариантом, поэтому в каталоге остаются только продукты, которые можно отобразить.</p>
        <form class="form" data-form="product-create">
          <div class="form-row">
            <label>Название <input name="name" required placeholder="Увлажняющая сыворотка" /></label>
            <label>ID категории <input name="category_id" required type="number" min="1" placeholder="1" /></label>
          </div>
          <label>Описание <textarea name="description" rows="2"></textarea></label>
          <div class="form-row">
            <label>Объем <input name="volume" type="number" step="0.01" placeholder="30" /></label>
            <label>Цена <input name="price" type="number" step="0.01" placeholder="1290" /></label>
          </div>
          <div class="form-row">
            <label>Статус
              <select name="status" required>
                <option value="new">new</option>
                <option value="in_use">in_use</option>
                <option value="finished">finished</option>
                <option value="expired">expired</option>
              </select>
            </label>
            <label>URL изображения <input name="image_url" type="url" /></label>
          </div>
          <label>Характеристики JSON <textarea name="features" rows="2" placeholder='{"shade":"01"}'></textarea></label>
          <button class="button primary" type="submit">Создать продукт</button>
        </form>
      </section>

      ${renderProductGrid(brandProducts)}
    </section>
  `);

  bindCreateProduct(brandId);
}
