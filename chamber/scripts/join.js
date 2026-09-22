document.querySelector('#timestamp').value = new Date().toISOString();

document.querySelectorAll('[data-dialog]').forEach((link) => {
  const dialog = document.getElementById(link.dataset.dialog);
  link.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
  });
  // Native dialogs support Escape and constrain keyboard focus while open.
  dialog.addEventListener('close', () => link.focus());
});
