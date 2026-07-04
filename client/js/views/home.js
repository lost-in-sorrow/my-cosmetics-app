import { setPage } from '../ui.js';

export function renderHomePage() {
  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Inventory</p>
          <h1>Cosmetics management panel</h1>
        </div>
        <a class="button primary" href="/brands" data-link>Open brands</a>
      </header>

      <div class="grid three">
        <article class="panel panel-body">
          <h2>Brands</h2>
          <p class="subtle">Alphabetical catalog, search, create, update, delete, and brand product navigation.</p>
        </article>
        <article class="panel panel-body">
          <h2>Catalog</h2>
          <p class="subtle">Product grid with images, price summary, statuses, and product detail cards.</p>
        </article>
        <article class="panel panel-body">
          <h2>Variants</h2>
          <p class="subtle">Edit volume, price, image URL, status, and JSON feature data.</p>
        </article>
      </div>
    </section>
  `);
}
