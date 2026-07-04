import { api } from '../api.js';
import { chips, setPage } from '../ui.js';
import { renderProductGrid } from './productCards.js';

export async function renderProductsPage() {
  const products = await api.getProducts();

  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Каталог</p>
          <h1>Продукты</h1>
        </div>
        ${chips([`${products.length} позиций`, 'только с вариантами'])}
      </header>

      ${renderProductGrid(products)}
    </section>
  `);
}
