import { api } from '../api.js';
import { chips, emptyState, escapeHtml, formToObject, setPage } from '../ui.js';

function firstCharacter(name) {
  return String(name || '').trim().charAt(0);
}

function brandSortBucket(name) {
  const first = firstCharacter(name);
  if (!first) return 0;
  if (/\d/.test(first)) return 1;
  if (/[A-Za-z]/.test(first)) return 2;
  if (/[А-Яа-яЁё]/.test(first)) return 3;
  return 0;
}

function groupKey(name) {
  const first = firstCharacter(name);
  if (!first || brandSortBucket(name) < 2) return '#';
  return first.toUpperCase();
}

function compareBrandNames(a, b) {
  const bucketDiff = brandSortBucket(a.name) - brandSortBucket(b.name);
  if (bucketDiff) return bucketDiff;
  return a.name.localeCompare(b.name, ['en', 'ru'], { numeric: true, sensitivity: 'base' });
}

function compareGroupKeys(a, b) {
  if (a === '#') return b === '#' ? 0 : -1;
  if (b === '#') return 1;
  const aLatin = /^[A-Z]$/.test(a);
  const bLatin = /^[A-Z]$/.test(b);
  if (aLatin !== bLatin) return aLatin ? -1 : 1;
  return a.localeCompare(b, ['en', 'ru'], { sensitivity: 'base' });
}

function sortedBrands(brands) {
  return [...brands].sort(compareBrandNames);
}

function groupBrands(brands) {
  return sortedBrands(brands).reduce((groups, brand) => {
    const letter = groupKey(brand.name);
    groups[letter] = groups[letter] || [];
    groups[letter].push(brand);
    return groups;
  }, {});
}

function sortedGroupKeys(groups) {
  return Object.keys(groups).sort(compareGroupKeys);
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
  const items = sortedBrands(brands);
  if (!items.length) return emptyState('Брендов пока нет');

  return `
    <div class="admin-brand-table">
      <div class="admin-brand-table-row header">
        <span>ID</span>
        <span>Название</span>
        <span>Действия</span>
      </div>
      ${items
        .map(
          (brand) => `
            <div class="admin-brand-table-row">
              <span class="mono">${brand.id}</span>
              <strong>${escapeHtml(brand.name)}</strong>
              <span class="admin-table-actions">
                <button class="button compact" data-action="brand-edit-row" data-brand-id="${brand.id}" type="button">Изменить</button>
                <button class="button compact danger" data-action="brand-delete-row" data-brand-id="${brand.id}" type="button">Удалить</button>
              </span>
            </div>
          `,
        )
        .join('')}
    </div>
  `;
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

function bindAlphabet() {
  document.querySelectorAll('[data-letter]').forEach((button) => {
    button.addEventListener('click', () => {
      const letter = button.dataset.letter;
      document.getElementById(`letter-${encodeURIComponent(letter)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
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

  document.querySelector('[data-action="brand-delete"]').addEventListener('click', async () => {
    const form = document.querySelector('[data-form="brand-update"]');
    if (!form.elements.id.value) {
      form.elements.id.reportValidity();
      return;
    }

    await api.deleteBrand(form.elements.id.value);
    form.reset();
    await load();
  });

  document.querySelectorAll('[data-action="brand-edit-row"]').forEach((button) => {
    button.addEventListener('click', () => {
      const brand = brands.find((item) => item.id === Number(button.dataset.brandId));
      const form = document.querySelector('[data-form="brand-update"]');
      if (!brand || !form) return;
      form.elements.id.value = brand.id;
      form.elements.name.value = brand.name;
      form.elements.name.focus();
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
  const letters = sortedGroupKeys(groups);

  setPage(`
    <section class="page brand-catalog-page">
      <header class="page-header">
        <div>
          <h1>Каталог брендов</h1>
        </div>
        ${chips([`${brands.length} брендов`])}
      </header>

      <section class="brand-catalog-tools">
        <div class="panel panel-body search-shell">
          <label>
            Поиск
            <input class="search-input compact" id="brandSearch" type="search" placeholder="Введите минимум 2 символа" autocomplete="off" />
          </label>
          <div class="suggestions hidden" id="brandSuggestions"></div>
        </div>

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
      <header class="page-header admin-page-header">
        <h1>Администрирование брендов</h1>
      </header>

      <section class="admin-brand-forms">
        <form class="panel panel-body form admin-brand-form" data-form="brand-create">
          <h2>Создание</h2>
          <div class="admin-inline-fields">
            <label>Название <input name="name" required minlength="2" maxlength="50" placeholder="Aesop" /></label>
            <button class="button primary" type="submit">Создать</button>
          </div>
        </form>

        <form class="panel panel-body form admin-brand-form" data-form="brand-update">
          <h2>Редактирование</h2>
          <div class="admin-edit-row">
            <label>ID <input name="id" required type="number" min="1" /></label>
            <label>Название <input name="name" required minlength="2" maxlength="50" /></label>
            <div class="actions">
              <button class="button primary" type="submit">Сохранить</button>
              <button class="button danger" data-action="brand-delete" type="button">Удалить</button>
            </div>
          </div>
        </form>
      </section>

      <section class="admin-brand-list panel panel-body">
        <div class="admin-list-heading">
          <h2>Список брендов</h2>
          ${chips([`${brands.length} всего`])}
        </div>
        ${renderAdminBrandTable(brands)}
      </section>
    </section>
  `);

  bindBrandCrud(paint, brands);
}
