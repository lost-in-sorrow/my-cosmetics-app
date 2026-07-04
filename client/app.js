import { router } from './js/router.js';
import { setStatus } from './js/ui.js';

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-link]');
  if (!link) return;

  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;

  event.preventDefault();
  router.navigate(url.pathname);
});

window.addEventListener('popstate', () => router.render());

setStatus('Ready', 'Interface loaded');
router.render();
