const dayInMilliseconds = 24 * 60 * 60 * 1000;

export function visitMessage(previousVisit, now = Date.now()) {
  const previous = Number(previousVisit);
  if (previousVisit === null || previousVisit === '' || !Number.isFinite(previous) || previous <= 0 || previous > now) {
    return 'Welcome! Let us know if you have any questions.';
  }
  const days = Math.floor((now - previous) / dayInMilliseconds);
  if (days < 1) return 'Back so soon! Awesome!';
  return `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
}
