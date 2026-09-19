const membersContainer = document.querySelector('#members');
const directoryStatus = document.querySelector('#directory-status');
const viewButtons = document.querySelectorAll('[data-view]');
const membershipLabels = { 1: 'Member', 2: 'Silver member', 3: 'Gold member' };

function createTextElement(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function displayMembers(members) {
  membersContainer.replaceChildren();
  members.forEach((member) => {
    const card = document.createElement('article');
    card.className = 'member-card';
    const heading = document.createElement('div');
    heading.className = 'member-heading';
    heading.appendChild(createTextElement('h2', member.name));
    heading.appendChild(createTextElement('p', member.tagline, 'tagline'));

    const body = document.createElement('div');
    body.className = 'member-body';
    const logo = document.createElement('img');
    logo.src = 'images/' + member.image;
    logo.alt = member.name + ' logo';
    logo.width = 72;
    logo.height = 72;
    logo.loading = 'lazy';
    const details = document.createElement('div');
    details.className = 'member-details';
    details.appendChild(createTextElement('p', member.address));
    const phone = document.createElement('a');
    phone.href = 'tel:' + member.phone.replace(/[^+\d]/g, '');
    phone.textContent = member.phone;
    const phoneLine = document.createElement('p');
    phoneLine.appendChild(phone);
    details.appendChild(phoneLine);
    const email = document.createElement('a');
    email.href = 'mailto:' + member.email;
    email.textContent = member.email;
    const emailLine = document.createElement('p');
    emailLine.appendChild(email);
    details.appendChild(emailLine);
    const website = document.createElement('a');
    website.href = member.website;
    website.textContent = 'Visit website ↗';
    website.setAttribute('aria-label', 'Visit ' + member.name + ' website');
    const websiteLine = document.createElement('p');
    websiteLine.appendChild(website);
    details.appendChild(websiteLine);
    details.appendChild(createTextElement('span', membershipLabels[member.membershipLevel],
      'membership ' + (member.membershipLevel === 3 ? 'gold' : member.membershipLevel === 2 ? 'silver' : 'standard')));
    body.appendChild(logo);
    body.appendChild(details);
    card.appendChild(heading);
    card.appendChild(body);
    membersContainer.appendChild(card);
  });
  directoryStatus.textContent = members.length + ' member businesses';
}

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const listView = button.dataset.view === 'list';
    membersContainer.classList.toggle('list', listView);
    viewButtons.forEach((viewButton) => {
      viewButton.setAttribute('aria-pressed', String(viewButton === button));
    });
  });
});

async function getMemberData() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Directory request failed: ' + response.status);
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    directoryStatus.textContent = 'We could not load the directory. Please refresh to try again.';
    console.error(error);
  }
}
getMemberData();

