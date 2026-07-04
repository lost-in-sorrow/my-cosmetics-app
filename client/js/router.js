import { activateNav, setPage, setStatus } from './ui.js';
import { renderBrandsPage } from './views/brands.js';
import { renderBrandProductsPage } from './views/brandProducts.js';
import { renderCategoriesPage } from './views/categories.js';
import { renderHomePage } from './views/home.js';
import { renderProductDetailPage } from './views/productDetail.js';
import { renderProductsPage } from './views/products.js';
import { renderVariantsPage } from './views/variants.js';

const routes = [
  { pattern: /^\/$/, render: renderHomePage },
  { pattern: /^\/brands$/, render: renderBrandsPage },
  { pattern: /^\/brands\/(\d+)$/, render: ([brandId]) => renderBrandProductsPage(Number(brandId)) },
  { pattern: /^\/products$/, render: renderProductsPage },
  { pattern: /^\/products\/(\d+)$/, render: ([productId]) => renderProductDetailPage(Number(productId)) },
  { pattern: /^\/categories$/, render: renderCategoriesPage },
  { pattern: /^\/variants$/, render: renderVariantsPage },
];

function matchRoute(pathname) {
  for (const route of routes) {
    const match = pathname.match(route.pattern);
    if (match) return () => route.render(match.slice(1));
  }

  return () => {
    setPage(`
      <section class="page">
        <header class="page-header">
          <div>
            <p class="kicker">404</p>
            <h1>Page not found</h1>
          </div>
          <a class="button primary" href="/brands" data-link>Go to brands</a>
        </header>
      </section>
    `);
  };
}

export const router = {
  navigate(pathname) {
    window.history.pushState({}, '', pathname);
    this.render();
  },

  async render() {
    const pathname = window.location.pathname;
    activateNav(pathname);

    try {
      await matchRoute(pathname)();
    } catch (error) {
      setStatus('Error', error.message, true);
      setPage(`
        <section class="page">
          <header class="page-header">
            <div>
              <p class="kicker">Error</p>
              <h1>${error.message}</h1>
            </div>
          </header>
        </section>
      `);
    }
  },
};
