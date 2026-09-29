document.querySelector('#timestamp').value = new Date().toISOString();

document.querySelectorAll('[data-dialog]').forEach((link) => {
  const dialog = document.getElementById(link.dataset.dialog);
  link.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
  });
  // Native dialogs support Escape and constrain keyboard focus while open.
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => link.focus());
});
