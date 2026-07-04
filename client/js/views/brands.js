import {
  renderAdminTable,
  renderCountBadge,
  renderIconButton,
  renderPageHeader,
  renderSearchPanel,
} from '../components/uiComponents.js';
import { api } from '../api.js';
import { emptyState, escapeHtml, formToObject, setPage } from '../ui.js';
import { compareAlphabetItems, compareCatalogNames, getAlphabetItems, getSortGroup } from '../shared/sort.js';

function sortedBrands(brands) {
  return [...brands].sort((a, b) => compareCatalogNames(a.name, b.name));
}

function groupBrands(brands) {
  return sortedBrands(brands).reduce((groups, brand) => {
    const letter = getSortGroup(brand.name).key;
    groups[letter] = groups[letter] || [];
    groups[letter].push(brand);
    return groups;
  }, {});
}

function sortedGroupKeys(groups) {
  return Object.keys(groups).sort(compareAlphabetItems);
}

function renderAlphabet(letters) {
  return `
    <div class="alphabet compact">
      ${letters.map((letter) => `<button class="letter-button" data-letter="${escapeHtml(letter)}" type="button">${escapeHtml(letter)}</button>`).join('')}
    </div>
  `;
}

function renderGroups(groups, { showId = false, dense = false, showLetters = true } = {}) {
  const letters = sortedGroupKeys(groups);
  if (!letters.length) return emptyState('Брендов пока нет');
  const directoryClass = dense ? 'brand-directory dense' : 'brand-directory';
  const rowClass = dense ? 'brand-row compact dense' : 'brand-row compact';

  return `
    <div class="${directoryClass}">
      ${letters
        .map(
          (letter) => `
            <section class="brand-group" id="letter-${encodeURIComponent(letter)}">
              ${showLetters ? `<h2 class="brand-letter">${escapeHtml(letter)}</h2>` : ''}
              <div class="brand-group-list">
                ${groups[letter]
                  .map(
                    (brand) => `
                      <a class="${rowClass}" href="/brands/${brand.id}" data-link data-brand-id="${brand.id}">
                        <strong>${escapeHtml(brand.name)}</strong>
                        ${showId ? `<span class="subtle">ID ${brand.id}</span>` : ''}
                      </a>
                    `,
                  )
                  .join('')}
              </div>
            </section>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderAdminBrandTable(brands) {
  return renderAdminTable({
    columns: [{ label: 'ID' }, { label: 'Название' }, { label: 'Действия' }],
    rows: sortedBrands(brands),
    emptyState: emptyState('Брендов пока нет'),
    getRowAttributes: (brand) => ` data-brand-row data-brand-id="${brand.id}" data-brand-name="${escapeHtml(brand.name.toLowerCase())}"`,
    renderActions: (brand) => `
      ${renderIconButton({
        type: 'edit',
        action: 'brand-edit-row',
        id: brand.id,
        title: 'Редактировать',
        ariaLabel: `Редактировать бренд ${brand.name}`,
      })}
      ${renderIconButton({
        type: 'delete',
        action: 'brand-delete-row',
        id: brand.id,
        title: 'Удалить',
        ariaLabel: `Удалить бренд ${brand.name}`,
      })}
    `,
  });
}

function bindSearch(brands) {
  const input = document.querySelector('#brandSearch');
  const suggestions = document.querySelector('#brandSuggestions');

  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    if (value.length < 2) {
      suggestions.classList.add('hidden');
      suggestions.innerHTML = '';
      return;
    }

    const matches = sortedBrands(brands)
      .filter((brand) => brand.name.toLowerCase().includes(value))
      .slice(0, 8);

    suggestions.innerHTML = matches.length
      ? matches
          .map(
            (brand) => `
              <a class="suggestion" href="/brands/${brand.id}" data-link>
                <span>${escapeHtml(brand.name)}</span>
                <span class="subtle">открыть</span>
              </a>
            `,
          )
          .join('')
      : `<div class="suggestion"><span>Совпадений нет</span></div>`;
    suggestions.classList.remove('hidden');
  });
}

function bindAdminSearch() {
  const input = document.querySelector('#adminBrandSearch');
  const rows = [...document.querySelectorAll('[data-brand-row]')];
  if (!input) return;

  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    rows.forEach((row) => {
      const name = row.dataset.brandName || '';
      const id = row.dataset.brandId || '';
      row.classList.toggle('hidden', Boolean(value) && !name.includes(value) && !id.includes(value));
    });
  });
}

function bindAlphabet() {
  document.querySelectorAll('[data-letter]').forEach((button) => {
    button.addEventListener('click', () => {
      const letter = button.dataset.letter;
      document.getElementById(`letter-${encodeURIComponent(letter)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function showEditPanel(brand) {
  const panel = document.querySelector('[data-panel="brand-edit"]');
  const form = document.querySelector('[data-form="brand-update"]');
  if (!panel || !form) return;

  panel.classList.remove('hidden');
  form.elements.id.value = brand.id;
  form.elements.name.value = brand.name;
  form.elements.name.focus();
}

function hideEditPanel() {
  const panel = document.querySelector('[data-panel="brand-edit"]');
  const form = document.querySelector('[data-form="brand-update"]');
  if (!panel || !form) return;

  form.reset();
  panel.classList.add('hidden');
}

function bindBrandCrud(load, brands = []) {
  document.querySelector('[data-form="brand-create"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.createBrand({ name: fields.name });
    await load();
  });

  document.querySelector('[data-form="brand-update"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.updateBrand(fields.id, { name: fields.name });
    await load();
  });

  document.querySelector('[data-action="brand-edit-cancel"]')?.addEventListener('click', hideEditPanel);

  document.querySelectorAll('[data-action="brand-edit-row"]').forEach((button) => {
    button.addEventListener('click', () => {
      const brand = brands.find((item) => item.id === Number(button.dataset.brandId));
      if (brand) showEditPanel(brand);
    });
  });

  document.querySelectorAll('[data-action="brand-delete-row"]').forEach((button) => {
    button.addEventListener('click', async () => {
      await api.deleteBrand(button.dataset.brandId);
      await load();
    });
  });
}

export async function renderBrandsPage() {
  const brands = await api.getBrands();
  const groups = groupBrands(brands);
  const letters = getAlphabetItems(brands, (brand) => brand.name);

  setPage(`
    <section class="page brand-catalog-page">
      ${renderPageHeader({ title: 'Каталог брендов', countLabel: `${brands.length} брендов` })}

      <section class="brand-catalog-tools">
        ${renderSearchPanel({
          label: 'Поиск',
          placeholder: 'Введите минимум 2 символа',
          id: 'brandSearch',
          extraHtml: '<div class="suggestions hidden" id="brandSuggestions"></div>',
        })}

        <div class="panel panel-body alphabet-panel">
          ${renderAlphabet(letters)}
        </div>
      </section>

      ${renderGroups(groups, { showLetters: false })}
    </section>
  `);

  bindSearch(brands);
  bindAlphabet();
}

export async function renderAdminBrandsPage() {
  const brands = await api.getBrands();
  const paint = async () => renderAdminBrandsPage();

  setPage(`
    <section class="page admin-brands-page">
      ${renderPageHeader({ title: 'Администрирование брендов', className: 'page-header admin-page-header' })}

      <section class="admin-brand-forms">
        <form class="panel panel-body form admin-brand-form" data-form="brand-create">
          <h2>Создание</h2>
          <div class="admin-inline-fields">
            <label>Название <input name="name" required minlength="2" maxlength="50" placeholder="Aesop" /></label>
            <button class="button primary" type="submit">Создать</button>
          </div>
        </form>

        ${renderSearchPanel({
          label: 'Название или ID',
          placeholder: 'Введите название или ID',
          id: 'adminBrandSearch',
          panelClass: 'panel panel-body form admin-brand-form',
          inputClass: '',
          title: 'Поиск',
          withSearchIcon: true,
        })}
      </section>

      <section class="panel panel-body form admin-brand-form admin-edit-panel hidden" data-panel="brand-edit">
        <h2>Редактирование</h2>
        <form class="admin-edit-row" data-form="brand-update">
          <label>ID <input name="id" required readonly type="number" min="1" /></label>
          <label>Название <input name="name" required minlength="2" maxlength="50" /></label>
          <div class="actions">
            <button class="button primary" type="submit">Сохранить</button>
            <button class="button" data-action="brand-edit-cancel" type="button">Отмена</button>
          </div>
        </form>
      </section>

      <section class="admin-brand-list panel panel-body">
        <div class="admin-list-heading">
          <h2>Список брендов</h2>
          ${renderCountBadge(`${brands.length} всего`)}
        </div>
        ${renderAdminBrandTable(brands)}
      </section>
    </section>
  `);

  bindBrandCrud(paint, brands);
  bindAdminSearch();
}
