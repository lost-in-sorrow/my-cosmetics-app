import { escapeHtml } from '../ui.js';

const iconPaths = {
  edit: `
    <path d="M4 20h4l10.7-10.7a2.1 2.1 0 0 0 0-3L17.7 5.3a2.1 2.1 0 0 0-3 0L4 16v4Z" />
    <path d="m13.8 6.2 4 4" />
  `,
  delete: `
    <path d="M5 7h14" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 7V5h6v2" />
    <path d="m7 7 1 13h8l1-13" />
  `,
  search: `
    <path d="m21 21-4.3-4.3" />
    <circle cx="11" cy="11" r="7" />
  `,
};

export function renderCountBadge(label) {
  return `<div class="meta"><span class="chip">${escapeHtml(label)}</span></div>`;
}

export function renderPageHeader({ title, countLabel, className = 'page-header' }) {
  return `
    <header class="${className}">
      <div>
        <h1>${escapeHtml(title)}</h1>
      </div>
      ${countLabel ? renderCountBadge(countLabel) : ''}
    </header>
  `;
}

export function renderSearchPanel({
  label,
  placeholder,
  id,
  value = '',
  panelClass = 'panel panel-body search-shell',
  inputClass = 'search-input compact',
  autocomplete = 'off',
  withSearchIcon = false,
  title = '',
  extraHtml = '',
}) {
  const classAttr = inputClass ? ` class="${escapeHtml(inputClass)}"` : '';
  const input = `<input${classAttr} id="${escapeHtml(id)}" type="search" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" autocomplete="${escapeHtml(autocomplete)}" />`;
  const field = withSearchIcon ? `<span class="admin-search-field">${input}</span>` : input;

  return `
    <div class="${panelClass}">
      ${title ? `<h2>${escapeHtml(title)}</h2>` : ''}
      <label>
        ${escapeHtml(label)}
        ${field}
      </label>
      ${extraHtml}
    </div>
  `;
}

export function renderIconButton({ type, action, id, title, ariaLabel }) {
  const icon = iconPaths[type] || iconPaths.search;
  const variantClass = type === 'delete' ? ' danger' : type === 'edit' ? ' edit' : '';

  return `
    <button class="icon-button${variantClass}" data-action="${escapeHtml(action)}" data-brand-id="${escapeHtml(id)}" type="button" title="${escapeHtml(title)}" aria-label="${escapeHtml(ariaLabel)}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        ${icon}
      </svg>
    </button>
  `;
}

export function renderAdminTable({ columns, rows, emptyState, renderActions, getRowAttributes = () => '' }) {
  if (!rows.length) return emptyState;

  return `
    <div class="admin-brand-table">
      <div class="admin-brand-table-row header">
        ${columns.map((column) => `<span>${escapeHtml(column.label)}</span>`).join('')}
      </div>
      ${rows
        .map(
          (row) => `
            <div class="admin-brand-table-row"${getRowAttributes(row)}>
              <span class="mono">${escapeHtml(row.id)}</span>
              <strong>${escapeHtml(row.name)}</strong>
              <span class="admin-table-actions">
                ${renderActions(row)}
              </span>
            </div>
          `,
        )
        .join('')}
    </div>
  `;
}
