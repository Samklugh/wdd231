const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#site-nav');
navigation.hidden = true;
menuButton.hidden = false;
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.hidden = expanded;
  menuButton.textContent = expanded ? 'Menu ☰' : 'Close ×';
});
navigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    navigation.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu ☰';
    menuButton.focus();
  }
});
document.querySelector('#current-year').textContent = new Date().getFullYear();
document.querySelector('#last-modified').textContent = document.lastModified;

