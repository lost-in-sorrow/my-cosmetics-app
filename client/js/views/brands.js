import { api } from '../api.js';
import { chips, emptyState, escapeHtml, formToObject, setPage } from '../ui.js';

function sortedBrands(brands) {
  return [...brands].sort((a, b) => a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' }));
}

function firstLetter(name) {
  return (name || '#').trim().charAt(0).toUpperCase() || '#';
}

function groupBrands(brands) {
  return sortedBrands(brands).reduce((groups, brand) => {
    const letter = firstLetter(brand.name);
    groups[letter] = groups[letter] || [];
    groups[letter].push(brand);
    return groups;
  }, {});
}

function renderAlphabet(letters) {
  return `
    <div class="alphabet">
      ${letters.map((letter) => `<button class="letter-button" data-letter="${escapeHtml(letter)}" type="button">${escapeHtml(letter)}</button>`).join('')}
    </div>
  `;
}

function renderGroups(groups) {
  const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'ru'));
  if (!letters.length) return emptyState('No brands yet');

  return letters
    .map(
      (letter) => `
        <section class="brand-group" id="letter-${encodeURIComponent(letter)}">
          <h2 class="brand-letter">${escapeHtml(letter)}</h2>
          ${groups[letter]
            .map(
              (brand) => `
                <a class="brand-row" href="/brands/${brand.id}" data-link data-brand-id="${brand.id}">
                  <strong>${escapeHtml(brand.name)}</strong>
                  <span class="subtle">ID ${brand.id}</span>
                </a>
              `,
            )
            .join('')}
        </section>
      `,
    )
    .join('');
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
                <span class="subtle">open</span>
              </a>
            `,
          )
          .join('')
      : `<div class="suggestion"><span>No matches</span></div>`;
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
  const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'ru'));

  const paint = async () => renderBrandsPage();

  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Brands</p>
          <h1>Brands</h1>
        </div>
        ${chips([`${brands.length} total`, 'alphabetical'])}
      </header>

      <section class="panel panel-body search-shell">
        <label>
          Brand search
          <input class="search-input" id="brandSearch" type="search" placeholder="Type at least 2 characters" autocomplete="off" />
        </label>
        <div class="suggestions hidden" id="brandSuggestions"></div>
      </section>

      <section class="panel panel-body">
        <h2>Alphabet</h2>
        ${renderAlphabet(letters)}
      </section>

      <section class="grid two">
        <form class="panel panel-body form" data-form="brand-create">
          <h2>Create brand</h2>
          <label>Name <input name="name" required minlength="2" maxlength="50" placeholder="Aesop" /></label>
          <button class="button primary" type="submit">Create</button>
        </form>

        <form class="panel panel-body form" data-form="brand-update">
          <h2>Edit brand</h2>
          <div class="form-row">
            <label>ID <input name="id" required type="number" min="1" /></label>
            <label>Name <input name="name" required minlength="2" maxlength="50" /></label>
          </div>
          <div class="actions">
            <button class="button primary" type="submit">Save</button>
            <button class="button danger" data-action="brand-delete" type="button">Delete</button>
          </div>
        </form>
      </section>

      <section class="grid">
        ${renderGroups(groups)}
      </section>
    </section>
  `);

  bindSearch(brands);
  bindAlphabet();
  bindBrandCrud(paint);
}
