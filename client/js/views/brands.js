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

function renderGroups(groups, { showId = false } = {}) {
  const letters = sortedGroupKeys(groups);
  if (!letters.length) return emptyState('Брендов пока нет');

  return `
    <div class="brand-directory">
      ${letters
        .map(
          (letter) => `
            <section class="brand-group" id="letter-${encodeURIComponent(letter)}">
              <h2 class="brand-letter">${escapeHtml(letter)}</h2>
              <div class="brand-group-list">
                ${groups[letter]
                  .map(
                    (brand) => `
                      <a class="brand-row compact" href="/brands/${brand.id}" data-link data-brand-id="${brand.id}">
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

function bindBrandCrud(load) {
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
}

export async function renderBrandsPage() {
  const brands = await api.getBrands();
  const groups = groupBrands(brands);
  const letters = sortedGroupKeys(groups);

  setPage(`
    <section class="page brand-catalog-page">
      <header class="page-header">
        <div>
          <p class="kicker">Бренды</p>
          <h1>Каталог брендов</h1>
        </div>
        ${chips([`${brands.length} всего`, 'символы, цифры, A-Z, А-Я'])}
      </header>

      <section class="brand-catalog-tools">
        <div class="panel panel-body search-shell">
          <label>
            Поиск бренда
            <input class="search-input compact" id="brandSearch" type="search" placeholder="Введите минимум 2 символа" autocomplete="off" />
          </label>
          <div class="suggestions hidden" id="brandSuggestions"></div>
        </div>

        <div class="panel panel-body alphabet-panel">
          ${renderAlphabet(letters)}
        </div>
      </section>

      ${renderGroups(groups)}
    </section>
  `);

  bindSearch(brands);
  bindAlphabet();
}

export async function renderAdminBrandsPage() {
  const brands = await api.getBrands();
  const groups = groupBrands(brands);
  const paint = async () => renderAdminBrandsPage();

  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Администрирование</p>
          <h1>Бренды</h1>
        </div>
        ${chips([`${brands.length} всего`, 'CRUD'])}
      </header>

      <section class="grid two">
        <form class="panel panel-body form" data-form="brand-create">
          <h2>Создать бренд</h2>
          <label>Название <input name="name" required minlength="2" maxlength="50" placeholder="Aesop" /></label>
          <button class="button primary" type="submit">Создать</button>
        </form>

        <form class="panel panel-body form" data-form="brand-update">
          <h2>Редактировать бренд</h2>
          <div class="form-row">
            <label>ID <input name="id" required type="number" min="1" /></label>
            <label>Название <input name="name" required minlength="2" maxlength="50" /></label>
          </div>
          <div class="actions">
            <button class="button primary" type="submit">Сохранить</button>
            <button class="button danger" data-action="brand-delete" type="button">Удалить</button>
          </div>
        </form>
      </section>

      ${renderGroups(groups, { showId: true })}
    </section>
  `);

  bindBrandCrud(paint);
}
