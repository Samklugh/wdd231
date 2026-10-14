import { getMusicians } from './data.js';
import { read, save } from './storage.js';

const $ = (selector) => document.querySelector(selector);
$('#year').textContent = new Date().getFullYear();
const menu = $('#menu');
menu.hidden = false;
menu.setAttribute('aria-expanded', 'false');
$('#navigation').classList.add('collapsed');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  $('#navigation').classList.toggle('collapsed', expanded);
});

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

const storedFavourites = read('favourites', []);
const favourites = new Set(Array.isArray(storedFavourites) ? storedFavourites : []);
let dialogTrigger;
const dialog = $('#profile-dialog');
if (dialog) {
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialogTrigger?.focus();
  });
}
function showProfile(musician, trigger) {
  dialogTrigger = trigger;
  const image = $('#profile-photo');
  image.src = musician.photo.src;
  image.alt = musician.photo.alt;
  image.width = musician.photo.width;
  image.height = musician.photo.height;
  $('#profile-title').textContent = musician.name;
  $('#profile-meta').textContent = `${musician.instrument} · ${musician.style}`;
  $('#profile-note').textContent = musician.note;
  $('#profile-bio').textContent = musician.bio;
  $('#profile-recording').textContent = musician.recording;
  $('#profile-link').href = musician.url;
  dialog.showModal();
  document.body.classList.add('modal-open');
  $('#close-dialog').focus();
}

function card(musician, detailed = false) {
  const article = node('article', undefined, 'card');
  const image = node('img', undefined, 'musician-photo');
  image.src = musician.photo.src;
  image.alt = musician.photo.alt;
  image.width = musician.photo.width;
  image.height = musician.photo.height;
  if (musician.photo.smallSrc && musician.photo.smallWidth < musician.photo.width) {
    image.srcset = `${musician.photo.smallSrc} ${musician.photo.smallWidth}w, ${musician.photo.src} ${musician.photo.width}w`;
    image.sizes = detailed
      ? '(max-width: 480px) calc(100vw - 48px), (max-width: 800px) calc(50vw - 47px), (max-width: 1050px) calc(33.333vw - 40px), 380px'
      : musician.id === '3'
        ? '(max-width: 700px) calc(100vw - 48px), (max-width: 800px) calc(100vw - 72px), 560px'
        : '(max-width: 430px) 95px, (max-width: 700px) 160px, 145px';
  }
  image.loading = 'lazy';
  image.decoding = 'async';
  if (musician.photo.position) image.style.objectPosition = musician.photo.position;
  article.append(image);
  article.append(node(detailed ? 'h2' : 'h3', musician.name));
  const details = node('dl');
  [['Instrument', musician.instrument], ['Style', musician.style], ['Start with', musician.recording]].forEach(([label, value]) => {
    details.append(node('dt', label), node('dd', value));
  });
  article.append(details);
  if (!detailed) {
    const link = node('a', 'Explore this musician →');
    link.href = `musicians.html?musician=${musician.id}`;
    article.append(link);
    return article;
  }
  const actions = node('div', undefined, 'actions');
  const learn = node('button', 'Learn more', 'secondary');
  learn.type = 'button';
  learn.setAttribute('aria-label', `Learn more about ${musician.name}`);
  learn.addEventListener('click', () => showProfile(musician, learn));
  const favourite = node('button');
  favourite.type = 'button';
  const updateButton = () => {
    const saved = favourites.has(musician.id);
    favourite.textContent = saved ? '★ Saved' : '☆ Save';
    favourite.setAttribute('aria-pressed', String(saved));
    favourite.setAttribute('aria-label', `${saved ? 'Remove' : 'Save'} ${musician.name} ${saved ? 'from' : 'to'} favourites`);
  };
  updateButton();
  favourite.addEventListener('click', () => {
    const wasSaved = favourites.has(musician.id);
    if (wasSaved) favourites.delete(musician.id); else favourites.add(musician.id);
    if (!save('favourites', [...favourites])) {
      if (wasSaved) favourites.add(musician.id); else favourites.delete(musician.id);
      $('#save-status').textContent = 'Browser storage is unavailable. Your favourites could not be saved.';
      return;
    }
    updateButton();
    $('#save-status').textContent = `${musician.name} ${wasSaved ? 'removed from' : 'added to'} your favourites.`;
    if ($('#favourites-only').checked) {
      renderCatalogue();
      $('#favourites-only').focus();
    }
  });
  actions.append(learn, favourite);
  article.append(actions);
  return article;
}

let musicians = [];
function renderCatalogue() {
  const results = musicians.filter((m) =>
    (!$('#instrument').value || m.instrument === $('#instrument').value) &&
    (!$('#style').value || m.style === $('#style').value) &&
    (!$('#favourites-only').checked || favourites.has(m.id)));
  $('#catalogue').replaceChildren(...results.map((m) => card(m, true)));
  $('#load-status').textContent = `${results.length} of ${musicians.length} musicians shown.`;
  if (!results.length) $('#catalogue').append(node('p', 'No musicians match these filters. Reset the filters or save a musician to your favourites.', 'empty'));
}

function plannerValues() {
  return {
    plan: $('#plan-name').value,
    date: $('#listening-date').value,
    musicians: [...document.querySelectorAll('[name="musician"]:checked')].map((input) => input.value),
    notes: $('#notes').value,
  };
}
function setupPlanner() {
  const form = $('#planner');
  const choices = $('#recording-choices');
  musicians.forEach((m) => {
    const label = node('label', undefined, 'check');
    const input = node('input');
    input.type = 'checkbox';
    input.name = 'musician';
    input.value = m.id;
    input.setAttribute('aria-describedby', 'selection-hint');
    const text = `${m.name} — ${m.recording}${favourites.has(m.id) ? ' ★ Favourite' : ''}`;
    label.append(input, node('span', text));
    choices.append(label);
  });
  const saved = read('plan', null);
  if (saved && typeof saved === 'object') {
    $('#plan-name').value = typeof saved.plan === 'string' ? saved.plan : '';
    $('#listening-date').value = typeof saved.date === 'string' ? saved.date : '';
    $('#notes').value = typeof saved.notes === 'string' ? saved.notes : '';
    choices.querySelectorAll('input').forEach((input) => {
      input.checked = Array.isArray(saved.musicians) && saved.musicians.includes(input.value);
    });
    showSavedPlan(saved);
  }
  const first = choices.querySelector('input');
  function checkSelection() {
    first.setCustomValidity(choices.querySelector('input:checked') ? '' : 'Choose at least one recording.');
  }
  choices.addEventListener('change', checkSelection);
  checkSelection();
  $('#create-plan').disabled = false;
  $('#save-draft').disabled = false;
  $('#save-draft').addEventListener('click', () => {
    const values = plannerValues();
    if (save('plan', values)) {
      showSavedPlan(values);
      $('#plan-status').textContent = 'Draft saved in this browser.';
    } else $('#plan-status').textContent = 'Browser storage is unavailable. You can still create a confirmation.';
  });
  form.addEventListener('submit', () => { save('plan', plannerValues()); });
  $('#clear-plan').addEventListener('click', () => {
    if (!save('plan', null)) {
      $('#plan-status').textContent = 'Browser storage is unavailable. The saved plan could not be cleared.';
      return;
    }
    form.reset();
    checkSelection();
    $('#saved-plan').replaceChildren();
    $('#plan-status').textContent = 'Saved plan cleared. Your favourites are unchanged.';
  });
  $('#load-status').textContent = `${musicians.length} recordings available. Your favourites are marked with a star.`;
}
function showSavedPlan(plan) {
  const summary = node('section', undefined, 'saved-plan');
  summary.append(node('h2', 'Your saved draft'), node('p', `${plan.plan || 'Untitled session'}${plan.date ? ` · ${plan.date}` : ''}`));
  const names = musicians.filter((m) => Array.isArray(plan.musicians) && plan.musicians.includes(m.id)).map((m) => `${m.name}: ${m.recording}`);
  summary.append(node('p', names.join(' · ') || 'No recordings chosen yet.'));
  $('#saved-plan').replaceChildren(summary);
}
function showConfirmation() {
  const params = new URLSearchParams(location.search);
  const ids = params.getAll('musician');
  const selected = musicians.filter((m) => ids.includes(m.id));
  if (!params.get('plan') || !params.get('date') || !selected.length) {
    $('#confirmation-status').textContent = 'There is no complete plan to display. Return to the planner to choose your recordings and date.';
    return;
  }
  const values = [
    ['Plan name', params.get('plan')],
    ['Listening date', params.get('date')],
    ['Recordings', selected.map((m) => `${m.name} — ${m.recording}`).join('; ')],
    ['Notes', params.get('notes') || 'No notes added.'],
  ];
  values.forEach(([label, value]) => $('#confirmation').append(node('dt', label), node('dd', value)));
  $('#confirmation-status').textContent = 'Your listening plan is ready. Choose a recording, settle in, and enjoy.';
}
$('#print-plan')?.addEventListener('click', () => window.print());

async function init() {
  if (!$('#catalogue') && !$('#featured') && !$('#planner') && !$('#confirmation')) return;
  try {
    musicians = await getMusicians(Boolean($('#featured')));
    if ($('#featured')) {
      const featured = ['3', '8', '2'].map((id) => musicians.find((m) => m.id === id));
      $('#featured').replaceChildren(...featured.map((m) => card(m)));
      $('#load-status').textContent = 'Three starting points from our catalogue.';
    }
    if ($('#catalogue')) {
      ['instrument', 'style'].forEach((key) => {
        [...new Set(musicians.map((m) => m[key]))].sort().forEach((value) => {
          const option = node('option', value);
          option.value = value;
          $(`#${key}`).append(option);
        });
        const requested = new URLSearchParams(location.search).get(key);
        if (requested && musicians.some((m) => m[key] === requested)) {
          $(`#${key}`).value = requested;
        }
        $(`#${key}`).addEventListener('change', renderCatalogue);
      });
      $('#favourites-only').addEventListener('change', renderCatalogue);
      $('#reset').addEventListener('click', () => {
        $('#instrument').value = '';
        $('#style').value = '';
        $('#favourites-only').checked = false;
        renderCatalogue();
      });
      renderCatalogue();
      const selected = musicians.find((m) => m.id === new URLSearchParams(location.search).get('musician'));
      if (selected) showProfile(selected, $('#catalogue button'));
    }
    if ($('#planner')) setupPlanner();
    if ($('#confirmation')) showConfirmation();
  } catch (error) {
    const status = $('#load-status') || $('#confirmation-status');
    status.textContent = 'The musician catalogue could not be loaded. Please reload this page. If you opened a local file, use a local web server instead.';
    status.classList.add('error');
    console.error('Jazz catalogue:', error);
  }
}
init();
