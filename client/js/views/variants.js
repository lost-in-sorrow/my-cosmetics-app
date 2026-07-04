import { api } from '../api.js';
import { formToObject, setPage, variantBody } from '../ui.js';

function bindVariantTools() {
  document.querySelector('[data-form="variant-tools"]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = formToObject(event.currentTarget);
    await api.updateVariant(fields.variant_id, variantBody(fields, { partial: true }));
  });

  document.querySelector('[data-action="variant-tools-finish"]').addEventListener('click', async () => {
    const form = document.querySelector('[data-form="variant-tools"]');
    if (!form.elements.variant_id.value) {
      form.elements.variant_id.reportValidity();
      return;
    }
    await api.finishVariant(form.elements.variant_id.value);
  });

  document.querySelector('[data-action="variant-tools-expire"]').addEventListener('click', async () => {
    const form = document.querySelector('[data-form="variant-tools"]');
    if (!form.elements.variant_id.value) {
      form.elements.variant_id.reportValidity();
      return;
    }
    await api.expireVariant(form.elements.variant_id.value);
  });
}

export function renderVariantsPage() {
  setPage(`
    <section class="page">
      <header class="page-header">
        <div>
          <p class="kicker">Variant tools</p>
          <h1>Variants</h1>
        </div>
      </header>

      <form class="panel panel-body form" data-form="variant-tools">
        <h2>Quick edit by Variant ID</h2>
        <label>Variant ID <input name="variant_id" required type="number" min="1" /></label>
        <div class="form-row">
          <label>Volume <input name="volume" type="number" step="0.01" /></label>
          <label>Price <input name="price" type="number" step="0.01" /></label>
        </div>
        <div class="form-row">
          <label>Status
            <select name="status">
              <option value="">do not change</option>
              <option value="new">new</option>
              <option value="in_use">in_use</option>
              <option value="finished">finished</option>
              <option value="expired">expired</option>
            </select>
          </label>
          <label>Image URL <input name="image_url" type="url" /></label>
        </div>
        <label>Features JSON <textarea name="features" rows="3"></textarea></label>
        <div class="actions">
          <button class="button primary" type="submit">Save</button>
          <button class="button" data-action="variant-tools-finish" type="button">finish</button>
          <button class="button danger" data-action="variant-tools-expire" type="button">expire</button>
        </div>
      </form>
    </section>
  `);

  bindVariantTools();
}
