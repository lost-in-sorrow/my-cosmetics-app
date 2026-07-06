import { escapeHtml } from '../ui.js';
import { buildCategoryTree, getCategoryPath } from '../shared/categoryTree.js';
import { compareCatalogNames } from '../shared/sort.js';

const noParentLabel = 'Без родителя';
const newCategoryLabel = 'Новая категория';
const pickerColumnRowStep = 35;
const pickerColumnMaxOffset = 150;

function categoryMaps(categories) {
  return {
    byId: new Map(categories.map((category) => [category.id, category])),
    childrenByParentId: buildCategoryTree(categories),
  };
}

function categoryPathLabel(category, byId) {
  return getCategoryPath(category, byId)
    .map((item) => item.name)
    .join(' → ');
}

function sortedCategoryOptions(categories, byId) {
  return [...categories]
    .map((category) => ({ category, path: categoryPathLabel(category, byId) }))
    .sort((a, b) => compareCatalogNames(a.path, b.path));
}

function pickerLabel(selectedId, byId) {
  const category = selectedId ? byId.get(Number(selectedId)) : null;
  return category ? categoryPathLabel(category, byId) : noParentLabel;
}

function previewLabel(selectedId, byId, categoryName) {
  if (!selectedId) return '';

  const parent = byId.get(Number(selectedId));
  if (!parent) return '';

  const name = categoryName.trim() || newCategoryLabel;
  return `Будет создано: ${categoryPathLabel(parent, byId)} → ${name}`;
}

function renderSearchResults(categories, byId, selectedId, query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = sortedCategoryOptions(categories, byId).filter(({ category }) => category.name.toLowerCase().includes(normalizedQuery));

  if (!matches.length) return '<div class="category-picker-empty">Категории не найдены</div>';

  return matches
    .map(
      ({ category, path }) => `
        <button class="category-picker-search-result ${String(category.id) === String(selectedId) ? 'active' : ''}" data-category-picker-option="${category.id}" type="button">
          <span class="category-picker-option-title">${escapeHtml(category.name)}</span>
          <span class="category-picker-option-path">${escapeHtml(path)}</span>
        </button>
      `,
    )
    .join('');
}

function renderColumn(items, { level, offset, selectedId, navigationPathIds, childrenByParentId }) {
  return `
    <div class="category-picker-column" style="--category-picker-column-offset: ${offset}px; --category-picker-column-level: ${level}">
      ${items
        .map((category) => {
          const children = childrenByParentId[String(category.id)] || [];
          const hasChildren = Boolean(children.length);
          const isSelected = String(category.id) === String(selectedId);
          const isInPath = navigationPathIds.has(category.id);

          return `
            <div class="category-picker-cascade-item ${isSelected ? 'active' : ''} ${isInPath ? 'in-path' : ''}">
              <button class="category-picker-cascade-select" data-category-picker-option="${category.id}" type="button">
                <span>${escapeHtml(category.name)}</span>
              </button>
              ${
                hasChildren
                  ? `
                    <button class="category-picker-cascade-next" data-category-picker-expand="${category.id}" type="button" aria-label="Открыть ${escapeHtml(category.name)}">
                      <span class="category-picker-cascade-chevron" aria-hidden="true"></span>
                    </button>
                  `
                  : ''
              }
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderCascade(categories, { selectedId, navigationPath }) {
  const { childrenByParentId } = categoryMaps(categories);
  const navigationPathIds = new Set(navigationPath.map((category) => category.id));
  const columns = [];
  let parentKey = 'root';
  let level = 0;
  let offset = 0;

  while (childrenByParentId[parentKey]?.length) {
    const items = childrenByParentId[parentKey];
    columns.push(renderColumn(items, { level, offset, selectedId, navigationPathIds, childrenByParentId }));

    const expanded = navigationPath[level];
    if (!expanded) break;

    const expandedIndex = items.findIndex((category) => category.id === expanded.id);
    offset += Math.min(Math.max(expandedIndex, 0) * pickerColumnRowStep, pickerColumnMaxOffset);
    parentKey = String(expanded.id);
    level += 1;
  }

  return columns.join('');
}

export function renderCategoryPicker({ id, name = 'parent_id', label, categories, selectedId = '' }) {
  const { byId } = categoryMaps(categories);
  const safeId = escapeHtml(id);

  return `
    <div class="category-picker" data-category-picker data-category-picker-id="${safeId}">
      <label class="category-picker-label" id="${safeId}-label">${escapeHtml(label)}</label>
      <input data-category-picker-value name="${escapeHtml(name)}" type="hidden" value="${escapeHtml(selectedId)}" />
      <button class="category-picker-trigger" data-category-picker-trigger type="button" aria-haspopup="dialog" aria-expanded="false" aria-labelledby="${safeId}-label">
        <span data-category-picker-selected>${escapeHtml(pickerLabel(selectedId, byId))}</span>
        <span class="category-picker-chevron" aria-hidden="true"></span>
      </button>
      <div class="category-picker-dropdown hidden" data-category-picker-dropdown>
        <input class="category-picker-search" data-category-picker-search type="search" placeholder="Поиск категории" autocomplete="off" />
        <button class="category-picker-root-option" data-category-picker-option="" type="button">${noParentLabel}</button>
        <div class="category-picker-content" data-category-picker-content></div>
      </div>
      <div class="category-picker-preview hidden" data-category-picker-preview></div>
    </div>
  `;
}

export function bindCategoryPickers(categories) {
  const { byId } = categoryMaps(categories);
  const pickers = [...document.querySelectorAll('[data-category-picker]')];
  const stateByPicker = new WeakMap();

  function stateFor(picker) {
    if (!stateByPicker.has(picker)) {
      const value = picker.querySelector('[data-category-picker-value]');
      const selected = value.value ? byId.get(Number(value.value)) : null;
      stateByPicker.set(picker, {
        navigationPath: selected ? getCategoryPath(selected, byId) : [],
      });
    }

    return stateByPicker.get(picker);
  }

  function closePicker(picker) {
    picker.querySelector('[data-category-picker-dropdown]')?.classList.add('hidden');
    picker.querySelector('[data-category-picker-trigger]')?.setAttribute('aria-expanded', 'false');
  }

  function selectValue(picker, selectedId) {
    const value = picker.querySelector('[data-category-picker-value]');
    const selected = selectedId ? byId.get(Number(selectedId)) : null;
    const state = stateFor(picker);

    value.value = selectedId || '';
    state.navigationPath = selected ? getCategoryPath(selected, byId) : [];
    value.dispatchEvent(new Event('change', { bubbles: true }));
    closePicker(picker);
  }

  function renderPicker(picker) {
    const value = picker.querySelector('[data-category-picker-value]');
    const selected = picker.querySelector('[data-category-picker-selected]');
    const search = picker.querySelector('[data-category-picker-search]');
    const content = picker.querySelector('[data-category-picker-content]');
    const preview = picker.querySelector('[data-category-picker-preview]');
    const rootOption = picker.querySelector('[data-category-picker-option=""]');
    const nameInput = picker.closest('form')?.elements.name;
    const selectedId = value.value;
    const query = search.value.trim();
    const previewText = previewLabel(selectedId, byId, nameInput?.value || '');
    const state = stateFor(picker);

    selected.textContent = pickerLabel(selectedId, byId);
    rootOption.classList.toggle('active', !selectedId);
    content.innerHTML = query
      ? `<div class="category-picker-search-results">${renderSearchResults(categories, byId, selectedId, query)}</div>`
      : `<div class="category-picker-cascade">${renderCascade(categories, { selectedId, navigationPath: state.navigationPath })}</div>`;
    preview.textContent = previewText;
    preview.classList.toggle('hidden', !previewText);
  }

  pickers.forEach((picker) => {
    const trigger = picker.querySelector('[data-category-picker-trigger]');
    const dropdown = picker.querySelector('[data-category-picker-dropdown]');
    const search = picker.querySelector('[data-category-picker-search]');
    const value = picker.querySelector('[data-category-picker-value]');
    const nameInput = picker.closest('form')?.elements.name;

    trigger.addEventListener('click', () => {
      const isOpen = !dropdown.classList.contains('hidden');
      dropdown.classList.toggle('hidden', isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        const selected = value.value ? byId.get(Number(value.value)) : null;
        stateFor(picker).navigationPath = selected ? getCategoryPath(selected, byId) : [];
        search.value = '';
        renderPicker(picker);
        search.focus();
      }
    });

    search.addEventListener('input', () => renderPicker(picker));
    value.addEventListener('change', () => renderPicker(picker));
    nameInput?.addEventListener('input', () => renderPicker(picker));

    picker.addEventListener('click', (event) => {
      const expand = event.target.closest('[data-category-picker-expand]');
      if (expand) {
        const category = byId.get(Number(expand.dataset.categoryPickerExpand));
        if (!category) return;
        stateFor(picker).navigationPath = getCategoryPath(category, byId);
        search.value = '';
        renderPicker(picker);
        return;
      }

      const option = event.target.closest('[data-category-picker-option]');
      if (!option) return;
      selectValue(picker, option.dataset.categoryPickerOption || '');
    });

    renderPicker(picker);
  });

  document.addEventListener('click', (event) => {
    pickers.forEach((picker) => {
      if (!picker.contains(event.target)) closePicker(picker);
    });
  });
}
