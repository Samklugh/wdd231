const params = new URLSearchParams(window.location.search);
const details = document.querySelector('#application-details');
const fields = [
  ['first-name', 'First name'],
  ['last-name', 'Last name'],
  ['email', 'Email address'],
  ['phone', 'Mobile phone number'],
  ['organization', 'Business or organisation'],
  ['timestamp', 'Application form opened'],
];
const levels = { np: 'NP Membership', bronze: 'Bronze Membership', silver: 'Silver Membership', gold: 'Gold Membership' };

if (!params.size) {
  document.querySelector('#summary-status').textContent = 'No application details were provided. Please complete the application form first.';
} else {
  fields.forEach(([name, label]) => {
    const term = document.createElement('dt');
    const value = document.createElement('dd');
    term.textContent = label;
    const submitted = params.get(name)?.trim();
    value.textContent = submitted || 'Not provided';
    if (name === 'timestamp' && submitted) {
      const date = new Date(submitted);
      if (Number.isNaN(date.getTime())) {
        value.textContent = 'Invalid date';
      } else {
        const time = document.createElement('time');
        time.dateTime = date.toISOString();
        time.textContent = new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'long', timeStyle: 'long', timeZone: 'Europe/London',
        }).format(date) + ' (London time)';
        value.replaceChildren(time);
      }
    }
    // Query parameters are untrusted: render text, never HTML.
    details.append(term, value);
  });
  const term = document.createElement('dt');
  const value = document.createElement('dd');
  term.textContent = 'Membership level';
  value.textContent = levels[params.get('membership')] || 'Not provided';
  details.append(term, value);
}
