const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#site-nav');
const desktopNavigation = window.matchMedia('(min-width: 960px)');
function syncNavigation() {
  navigation.hidden = !desktopNavigation.matches;
  menuButton.hidden = desktopNavigation.matches;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu ☰';
}
syncNavigation();
desktopNavigation.addEventListener('change', syncNavigation);
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.hidden = expanded;
  menuButton.textContent = expanded ? 'Menu ☰' : 'Close ×';
});
navigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !desktopNavigation.matches) {
    navigation.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu ☰';
    menuButton.focus();
  }
});
document.querySelector('#current-year').textContent = new Date().getFullYear();
document.querySelector('#last-modified').textContent = document.lastModified;

