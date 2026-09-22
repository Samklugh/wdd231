import { weatherApiKey } from './weather-config.js';
import { selectSpotlights, threeDayForecast } from './home-data.js';

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

async function fetchJSON(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

async function loadSpotlights() {
  const status = document.querySelector('#spotlight-status');
  try {
    const members = await fetchJSON('data/members.json');
    const selected = selectSpotlights(members);
    if (selected.length < 2) throw new Error('Not enough eligible members');
    const cards = selected.map((member) => {
      const card = element('article', undefined, 'member-card');
      const heading = element('div', undefined, 'member-heading');
      heading.append(element('h3', member.name), element('p', member.tagline, 'tagline'));
      const body = element('div', undefined, 'member-body');
      const logo = element('img');
      logo.src = `images/${member.image}`;
      logo.alt = `${member.name} logo`;
      logo.width = 72;
      logo.height = 72;
      logo.loading = 'lazy';
      const details = element('div', undefined, 'member-details');
      const phone = element('a', member.phone);
      phone.href = `tel:${member.phone.replace(/[^+\d]/g, '')}`;
      const phoneLine = element('p');
      phoneLine.append(phone);
      const website = element('a', 'Visit website ↗');
      website.href = member.website;
      website.setAttribute('aria-label', `Visit ${member.name} website`);
      const websiteLine = element('p');
      websiteLine.append(website);
      const tier = member.membershipLevel === 3 ? 'Gold' : 'Silver';
      details.append(element('p', member.address), phoneLine, websiteLine,
        element('span', `${tier} member`, `membership ${tier.toLowerCase()}`));
      body.append(logo, details);
      card.append(heading, body);
      return card;
    });
    document.querySelector('#spotlight-members').replaceChildren(...cards);
    status.textContent = '';
  } catch {
    status.textContent = 'Member spotlights are unavailable. Please refresh to try again or explore the directory.';
  }
}

function weatherURL(endpoint) {
  const params = new URLSearchParams({
    lat: '51.5074', lon: '-0.1278', units: 'metric', appid: weatherApiKey,
  });
  return `https://api.openweathermap.org/data/2.5/${endpoint}?${params}`;
}

async function loadCurrentWeather() {
  const status = document.querySelector('#weather-status');
  try {
    const data = await fetchJSON(weatherURL('weather'));
    if (!Number.isFinite(data.main?.temp) || !data.weather?.[0]?.description ||
        !Number.isFinite(data.dt)) throw new Error('Incomplete current weather');
    document.querySelector('#temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('#weather-description').textContent = data.weather[0].description;
    const observed = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    }).format(new Date(data.dt * 1000));
    document.querySelector('#weather-updated').textContent = `Observed ${observed} · London time`;
    document.querySelector('#current-weather').hidden = false;
    status.textContent = '';
  } catch {
    status.textContent = 'Current weather is unavailable. Please try again later.';
  }
}

async function loadForecast() {
  const status = document.querySelector('#forecast-status');
  try {
    const data = await fetchJSON(weatherURL('forecast'));
    const days = threeDayForecast(data.list);
    if (days.length !== 3) throw new Error('Incomplete forecast');
    const rows = days.map((day) => {
      const row = element('li');
      const label = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short',
      }).format(new Date(`${day.date}T12:00:00Z`));
      const time = element('time', label);
      time.dateTime = day.date;
      row.append(time, element('strong', `${Math.round(day.low)}° / ${Math.round(day.high)}°`));
      return row;
    });
    document.querySelector('#forecast').replaceChildren(...rows);
    status.textContent = '';
  } catch {
    status.textContent = 'The forecast is unavailable. Please try again later.';
  }
}

loadSpotlights();
if (weatherApiKey.trim()) {
  // Keep current conditions, forecast, and member loading independent.
  loadCurrentWeather();
  loadForecast();
} else {
  document.querySelector('#weather-status').textContent = 'Current weather is temporarily unavailable.';
  document.querySelector('#forecast-status').textContent = 'The forecast is temporarily unavailable.';
}
