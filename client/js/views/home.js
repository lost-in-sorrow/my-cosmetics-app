import { setPage } from '../ui.js';

export function renderHomePage() {
  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Инвентарь</p>
          <h1>Панель управления косметикой</h1>
        </div>
        <a class="button primary" href="/brands" data-link>Открыть бренды</a>
      </header>

      <div class="grid three">
        <article class="panel panel-body">
          <h2>Категории</h2>
          <p class="subtle">Структура каталога для навигации по продуктам и группам ухода.</p>
        </article>
        <article class="panel panel-body">
          <h2>Продукты</h2>
          <p class="subtle">Карточки продуктов с изображениями, ценами, статусами и вариантами внутри продукта.</p>
        </article>
        <article class="panel panel-body">
          <h2>Бренды</h2>
          <p class="subtle">Компактный каталог брендов с поиском, алфавитной навигацией и переходом к товарам бренда.</p>
        </article>
      </div>
    </section>
  `);
}
