import {
  renderAdminTable,
  renderCountBadge,
  renderIconButton,
  renderPageHeader,
  renderSearchPanel,
} from '../components/uiComponents.js';
import { api } from '../api.js';
import { emptyState, escapeHtml, formToObject, numberOrNull, setPage } from '../ui.js';
import { buildCategoryTree, getCategoryPath } from '../shared/categoryTree.js';
import { compareCatalogNames } from '../shared/sort.js';

function sortedCategories(categories) {
  return [...categories].sort((a, b) => compareCatalogNames(a.name, b.name));
}

function categoryMaps(categories) {
  return {
    byId: new Map(categories.map((category) => [category.id, category])),
    childrenByParentId: buildCategoryTree(categories),
  };
}

const categoryCascadeRowStep = 36;

function renderCategoryColumn(items, { level, offset, selectedId, selectedPathIds, childrenByParentId }) {
  return `
    <div class="category-column" data-category-column="${level}" style="--category-column-offset: ${offset}px; --category-column-level: ${level}">
      <div class="category-column-body">
        ${items
          .map((category) => {
            const children = childrenByParentId[String(category.id)] || [];
            const hasChildren = Boolean(children.length);
            const isSelected = category.id === selectedId;
            const isInPath = selectedPathIds.has(category.id);
            const stateClass = isSelected ? 'active' : isInPath ? 'in-path' : '';

            return `
              <button
                class="category-tree-row ${stateClass} ${hasChildren ? 'has-children' : 'is-leaf'}"
                data-category-id="${category.id}"
                type="button"
                ${isSelected ? 'aria-current="true"' : ''}
              >
                <span class="category-tree-node-name">${escapeHtml(category.name)}</span>
                ${hasChildren ? '<span class="category-row-arrow" aria-hidden="true"></span>' : '<span class="category-row-leaf" aria-hidden="true"></span>'}
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}

function renderCategoryColumns(categories, selectedPath = []) {
  const { childrenByParentId } = categoryMaps(categories);
  const selectedPathIds = new Set(selectedPath.map((category) => category.id));
  const selectedId = selectedPath.at(-1)?.id;
  const columns = [];
  let parentKey = 'root';
  let level = 0;
  let offset = 0;

  while (childrenByParentId[parentKey]?.length) {
    const items = childrenByParentId[parentKey];
    columns.push(renderCategoryColumn(items, { level, offset, selectedId, selectedPathIds, childrenByParentId }));

    const selected = selectedPath[level];
    if (!selected) break;

    const selectedIndex = items.findIndex((category) => category.id === selected.id);
    offset += Math.max(selectedIndex, 0) * categoryCascadeRowStep;
    parentKey = String(selected.id);
    level += 1;
  }

  return columns.join('');
}

function renderCategoryBreadcrumb(selectedPath = []) {
  if (!selectedPath.length) return '';

  return `
    <nav class="category-breadcrumb" aria-label="Category path">
      ${selectedPath
        .map(
          (category, index) => `
            <button class="category-breadcrumb-item" data-category-id="${category.id}" type="button">
              ${escapeHtml(category.name)}
            </button>
            ${index < selectedPath.length - 1 ? '<span class="category-breadcrumb-separator">/</span>' : ''}
          `,
        )
        .join('')}
    </nav>
  `;
}

function renderSearchResults(matches, byId) {
  if (!matches.length) return emptyState('Категории не найдены');

  return `
    <div class="category-search-results">
      ${matches
        .map((category) => {
          const path = getCategoryPath(category, byId).map((item) => item.name).join(' / ');
          return `
            <button class="category-search-result" data-category-id="${category.id}" type="button">
              <span class="category-search-result-name">${escapeHtml(category.name)}</span>
              <span class="category-search-result-path">${escapeHtml(path)}</span>
            </button>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderCategoryTree(categories, selectedPath = [], searchValue = '') {
  const { byId } = categoryMaps(categories);
  const query = searchValue.trim().toLowerCase();

  if (!categories.length) return emptyState('Категорий пока нет');

  const matches = query ? sortedCategories(categories).filter((category) => category.name.toLowerCase().includes(query)) : [];

  return `
    ${renderCategoryBreadcrumb(selectedPath)}
    ${
      query
        ? `
          <section class="category-search-results-shell" aria-label="Результаты поиска">
            ${renderSearchResults(matches, byId)}
          </section>
        `
        : ''
    }
    <div class="category-tree-shell">
      ${renderCategoryColumns(categories, selectedPath)}
    </div>
  `;
}

function renderParentOptions(categories, selectedId = '') {
  return `
    <option value="">Нет</option>
    ${sortedCategories(categories)
      .map((category) => `<option value="${category.id}" ${String(category.id) === String(selectedId) ? 'selected' : ''}>${escapeHtml(category.name)}</option>`)
      .join('')}
  `;
}

function parentName(category, byId) {
  return category.parent_id == null ? 'Нет' : byId.get(category.parent_id)?.name || `ID ${category.parent_id}`;
}

function renderAdminCategoryTable(categories) {
  const { byId } = categoryMaps(categories);

  return renderAdminTable({
    columns: [{ label: 'ID' }, { label: 'Название' }, { label: 'Родительская категория' }, { label: 'Действия' }],
    rows: sortedCategories(categories),
    emptyState: emptyState('Категорий пока нет'),
    tableClass: 'admin-brand-table admin-category-table',
    rowClass: 'admin-brand-table-row admin-category-table-row',
    getRowAttributes: (category) => ` data-category-row data-category-id="${category.id}" data-category-name="${escapeHtml(category.name.toLowerCase())}"`,
    renderCells: (category) => `
      <span class="mono">${category.id}</span>
      <strong>${escapeHtml(category.name)}</strong>
      <span class="subtle">${escapeHtml(parentName(category, byId))}</span>
      <span class="admin-table-actions">
        ${renderIconButton({
          type: 'edit',
          action: 'category-edit-row',
          id: category.id,
          title: 'Редактировать',
          ariaLabel: `Редактировать категорию ${category.name}`,
          dataAttribute: 'data-category-id',
        })}
        ${renderIconButton({
          type: 'delete',
          action: 'category-delete-row',
          id: category.id,
          title: 'Удалить',
          ariaLabel: `Удалить категорию ${category.name}`,
          dataAttribute: 'data-category-id',
        })}
      </span>
    `,
  });
}

function bindCategoryCatalog(categories) {
  const { byId, childrenByParentId } = categoryMaps(categories);
  const root = document.querySelector('[data-category-catalog]');
  const search = document.querySelector('#categorySearch');
  let selectedPath = [];
  let shouldFocusSelected = false;

  function selectCategory(category) {
    selectedPath = getCategoryPath(category, byId);
    const hasChildren = Boolean(childrenByParentId[String(category.id)]?.length);
    if (hasChildren) return;

    // TODO: navigate to the category products view when a supported category filter route exists.
  }

  function render() {
    root.innerHTML = renderCategoryTree(categories, selectedPath, search.value);
    if (!shouldFocusSelected) return;

    root.querySelector('.category-tree-row.active')?.scrollIntoView({ block: 'nearest' });
    shouldFocusSelected = false;
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category-id]');
    if (!button) return;
    const category = byId.get(Number(button.dataset.categoryId));
    if (!category) return;
    selectCategory(category);
    shouldFocusSelected = Boolean(search.value.trim());
    search.value = '';
    render();
  });

  search.addEventListener('input', render);
}

function bindAdminCategorySearch() {
  const input = document.querySelector('#adminCategorySearch');
  const rows = [...document.querySelectorAll('[data-category-row]')];
  if (!input) return;

  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    rows.forEach((row) => {
      const name = row.dataset.categoryName || '';
      const id = row.dataset.categoryId || '';
      row.classList.toggle('hidden', Boolean(value) && !name.includes(value) && !id.includes(value));
    });
  });
}

function showEditPanel(category) {
  const panel = document.querySelector('[data-panel="category-edit"]');
  const form = document.querySelector('[data-form="category-update"]');
  if (!panel || !form) return;

  panel.classList.remove('hidden');
  form.elements.id.value = category.id;
  form.elements.name.value = category.name;
  form.elements.parent_id.value = category.parent_id ?? '';
  form.elements.name.focus();
}

function hideEditPanel() {
  const panel = document.querySelector('[data-panel="category-edit"]');
  const form = document.querySelector('[data-form="category-update"]');
  if (!panel || !form) return;

  form.reset();
  panel.classList.add('hidden');
}

function bindCategoryCrud(load, categories = []) {
  document.querySelector('[data-form="category-create"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.createCategory({ name: fields.name, parent_id: numberOrNull(fields.parent_id) });
    await load();
  });

  document.querySelector('[data-form="category-update"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.updateCategory(fields.id, { name: fields.name, parent_id: numberOrNull(fields.parent_id) });
    await load();
  });

  document.querySelector('[data-action="category-edit-cancel"]')?.addEventListener('click', hideEditPanel);

  document.querySelectorAll('[data-action="category-edit-row"]').forEach((button) => {
    button.addEventListener('click', () => {
      const category = categories.find((item) => item.id === Number(button.dataset.categoryId));
      if (category) showEditPanel(category);
    });
  });

  document.querySelectorAll('[data-action="category-delete-row"]').forEach((button) => {
    button.addEventListener('click', async () => {
      await api.deleteCategory(button.dataset.categoryId);
      await load();
    });
  });
}

export async function renderCategoriesPage() {
  const categories = await api.getCategories();

  setPage(`
    <section class="page category-catalog-page">
      ${renderPageHeader({ title: 'Каталог категорий', countLabel: `${categories.length} категорий` })}

      <section class="category-catalog-tools">
        ${renderSearchPanel({
          label: 'Поиск',
          placeholder: 'Введите название категории',
          id: 'categorySearch',
          panelClass: 'panel panel-body search-shell category-search-panel',
        })}
      </section>

      <section class="category-catalog-browser" data-category-catalog>
        ${renderCategoryTree(categories)}
      </section>
    </section>
  `);

  bindCategoryCatalog(categories);
}

export async function renderAdminCategoriesPage() {
  const categories = await api.getCategories();
  const paint = async () => renderAdminCategoriesPage();

  setPage(`
    <section class="page admin-brands-page">
      ${renderPageHeader({ title: 'Администрирование категорий', className: 'page-header admin-page-header' })}

      <section class="admin-brand-forms">
        <form class="panel panel-body form admin-brand-form" data-form="category-create">
          <h2>Создание</h2>
          <div class="admin-category-create-row">
            <label>Название <input name="name" required minlength="2" /></label>
            <label>Родительская категория <select name="parent_id">${renderParentOptions(categories)}</select></label>
            <button class="button primary" type="submit">Создать</button>
          </div>
        </form>

        ${renderSearchPanel({
          label: 'Название или ID',
          placeholder: 'Введите название или ID',
          id: 'adminCategorySearch',
          panelClass: 'panel panel-body form admin-brand-form',
          inputClass: '',
          title: 'Поиск',
          withSearchIcon: true,
        })}
      </section>

      <section class="panel panel-body form admin-brand-form admin-edit-panel hidden" data-panel="category-edit">
        <h2>Редактирование</h2>
        <form class="admin-category-edit-row" data-form="category-update">
          <label>ID <input name="id" required readonly type="number" min="1" /></label>
          <label>Название <input name="name" required minlength="2" /></label>
          <label>Родительская категория <select name="parent_id">${renderParentOptions(categories)}</select></label>
          <div class="actions">
            <button class="button primary" type="submit">Сохранить</button>
            <button class="button" data-action="category-edit-cancel" type="button">Отмена</button>
          </div>
        </form>
      </section>

      <section class="admin-brand-list panel panel-body">
        <div class="admin-list-heading">
          <h2>Список категорий</h2>
          ${renderCountBadge(`${categories.length} всего`)}
        </div>
        ${renderAdminCategoryTable(categories)}
      </section>
    </section>
  `);

  bindCategoryCrud(paint, categories);
  bindAdminCategorySearch();
}

