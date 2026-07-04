import { api } from '../api.js';
import { chips, emptyState, escapeHtml, formToObject, numberOrNull, setPage } from '../ui.js';

function renderCategoryList(categories) {
  if (!categories.length) return emptyState('Категорий пока нет');

  return `
    <div class="grid">
      ${categories
        .map(
          (category) => `
            <article class="brand-row">
              <strong>${escapeHtml(category.name)}</strong>
              <span class="subtle">ID ${category.id} | родительская ${category.parent_id ?? 'нет'}</span>
            </article>
          `,
        )
        .join('')}
    </div>
  `;
}

function bindCategoryForms() {
  document.querySelector('[data-form="category-create"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.createCategory({ name: fields.name, parent_id: numberOrNull(fields.parent_id) });
    await renderCategoriesPage();
  });

  document.querySelector('[data-form="category-update"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.updateCategory(fields.id, { name: fields.name, parent_id: numberOrNull(fields.parent_id) });
    await renderCategoriesPage();
  });

  document.querySelector('[data-action="category-delete"]').addEventListener('click', async () => {
    const form = document.querySelector('[data-form="category-update"]');
    if (!form.elements.id.value) {
      form.elements.id.reportValidity();
      return;
    }

    await api.deleteCategory(form.elements.id.value);
    await renderCategoriesPage();
  });
}

export async function renderCategoriesPage() {
  const categories = await api.getCategories();

  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Категории</p>
          <h1>Категории</h1>
        </div>
        ${chips([`${categories.length} всего`])}
      </header>

      <section class="grid two">
        <form class="panel panel-body form" data-form="category-create">
          <h2>Создать категорию</h2>
          <label>Название <input name="name" required minlength="2" /></label>
          <label>Родительская ID <input name="parent_id" type="number" min="1" /></label>
          <button class="button primary" type="submit">Создать</button>
        </form>

        <form class="panel panel-body form" data-form="category-update">
          <h2>Редактировать категорию</h2>
          <div class="form-row">
            <label>ID <input name="id" required type="number" min="1" /></label>
            <label>Название <input name="name" required minlength="2" /></label>
          </div>
          <label>Родительская ID <input name="parent_id" type="number" min="1" /></label>
          <div class="actions">
            <button class="button primary" type="submit">Сохранить</button>
            <button class="button danger" data-action="category-delete" type="button">Удалить</button>
          </div>
        </form>
      </section>

      ${renderCategoryList(categories)}
    </section>
  `);

  bindCategoryForms();
}
