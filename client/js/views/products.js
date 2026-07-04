import { api } from '../api.js';
import { chips, setPage } from '../ui.js';
import { renderProductGrid } from './productCards.js';

export async function renderProductsPage() {
  const products = await api.getProducts();

  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Catalog</p>
          <h1>Products</h1>
        </div>
        ${chips([`${products.length} items`, 'with variants only'])}
      </header>

      ${renderProductGrid(products)}
    </section>
  `);
}
