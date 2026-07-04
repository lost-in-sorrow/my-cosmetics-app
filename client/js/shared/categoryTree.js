import { compareCatalogNames } from './sort.js';

export function getChildrenByParentId(categories) {
  return categories.reduce((groups, category) => {
    const key = category.parent_id == null ? 'root' : String(category.parent_id);
    groups[key] = groups[key] || [];
    groups[key].push(category);
    return groups;
  }, {});
}

export function buildCategoryTree(categories) {
  const childrenByParentId = getChildrenByParentId(categories);
  Object.values(childrenByParentId).forEach((items) => {
    items.sort((a, b) => compareCatalogNames(a.name, b.name));
  });
  return childrenByParentId;
}

export function getCategoryPath(category, byId) {
  const path = [];
  const seen = new Set();
  let current = category;

  while (current && !seen.has(current.id)) {
    path.unshift(current);
    seen.add(current.id);
    current = current.parent_id == null ? null : byId.get(current.parent_id);
  }

  return path;
}
