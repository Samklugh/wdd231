export function selectSpotlights(members, random = Math.random) {
  const eligible = members.filter((member) => [2, 3].includes(member.membershipLevel));
  // Fisher–Yates gives every eligible member an equal chance without duplicates.
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }
  return eligible.slice(0, 3);
}

export function londonDate(timestamp) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(timestamp));
}

export function threeDayForecast(entries, now = Date.now()) {
  const today = londonDate(now);
  const days = new Map();
  for (const entry of entries) {
    const date = londonDate(entry.dt * 1000);
    if (date <= today || !Number.isFinite(entry.main?.temp_min) ||
        !Number.isFinite(entry.main?.temp_max)) continue;
    const day = days.get(date) || { date, low: Infinity, high: -Infinity };
    day.low = Math.min(day.low, entry.main.temp_min);
    day.high = Math.max(day.high, entry.main.temp_max);
    days.set(date, day);
  }
  // Aggregate the three-hour samples into separate London calendar days.
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
}
