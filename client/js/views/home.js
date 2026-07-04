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
          <h2>Бренды</h2>
          <p class="subtle">Алфавитный каталог, поиск, создание, обновление, удаление и переход к продуктам бренда.</p>
        </article>
        <article class="panel panel-body">
          <h2>Каталог</h2>
          <p class="subtle">Сетка продуктов с изображениями, сводкой цен, статусами и карточками деталей продукта.</p>
        </article>
        <article class="panel panel-body">
          <h2>Варианты</h2>
          <p class="subtle">Редактирование объема, цены, URL изображения, статуса и данных характеристик в JSON.</p>
        </article>
      </div>
    </section>
  `);
}
