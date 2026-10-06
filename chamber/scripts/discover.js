import { places } from '../data/places.mjs';
import { visitMessage } from './visit-message.mjs';

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

const message = document.querySelector('#visit-message');
const now = Date.now();
try {
  message.textContent = visitMessage(localStorage.getItem('london-discover-last-visit'), now);
  localStorage.setItem('london-discover-last-visit', String(now));
} catch {
  // The gallery remains usable when browser privacy settings disable storage.
  message.textContent = visitMessage(null, now);
}

const dialog = document.querySelector('#place-dialog');
let activeButton;
document.querySelector('#close-place-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => activeButton?.focus());

const cards = places.map((place, index) => {
  const card = element('article', undefined, `discover-card place-${index + 1}`);
  const heading = element('h2', place.name);
  heading.id = place.id;
  card.setAttribute('aria-labelledby', heading.id);
  const figure = element('figure');
  const image = element('img');
  image.src = `images/${place.image}`;
  image.alt = place.alt;
  image.width = 300;
  image.height = 200;
  image.loading = index === 0 ? 'eager' : 'lazy';
  image.decoding = 'async';
  figure.append(image);
  const button = element('button', 'Learn more', 'discover-button');
  button.type = 'button';
  button.setAttribute('aria-label', `Learn more about ${place.name}`);
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', () => {
    activeButton = button;
    document.querySelector('#place-dialog-title').textContent = place.name;
    document.querySelector('#place-dialog-address').textContent = place.address;
    document.querySelector('#place-dialog-description').textContent = place.details;
    const website = document.querySelector('#place-dialog-link');
    website.href = place.website;
    website.textContent = `Visit ${place.name}'s official website`;
    dialog.showModal();
  });
  card.append(heading, figure, element('address', place.address), element('p', place.description), button);
  return card;
});
document.querySelector('#discover-gallery').replaceChildren(...cards);

const credits = places.map((place) => {
  const item = element('li');
  const source = element('a', place.name);
  source.href = place.photo.source;
  const licence = element('a', place.photo.licence);
  licence.href = place.photo.licenceUrl;
  item.append(source, document.createTextNode(`: ${place.photo.author} · `), licence,
    document.createTextNode(' · cropped and resized to WebP.'));
  return item;
});
document.querySelector('#photo-credits').replaceChildren(...credits);
