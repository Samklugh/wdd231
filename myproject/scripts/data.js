export async function getMusicians(featuredOnly = false) {
  const path = featuredOnly ? '../data/featured-musicians.json' : '../data/musicians.json';
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Catalogue request failed: ${response.status}`);
  const musicians = await response.json();
  if (!Array.isArray(musicians) || musicians.length < (featuredOnly ? 3 : 15)) throw new Error('Incomplete catalogue');
  return musicians;
}
