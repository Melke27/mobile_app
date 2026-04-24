const tokenize = (text = '') =>
  text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

const overlap = (a, b) => {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;

  let n = 0;
  A.forEach((token) => {
    if (B.has(token)) n += 1;
  });

  return n / Math.max(A.size, B.size);
};

const distanceKm = (a, b) => {
  if (!a || !b) return 999;
  const d2r = Math.PI / 180;
  const r = 6371;
  const dLat = (b.latitude - a.latitude) * d2r;
  const dLon = (b.longitude - a.longitude) * d2r;
  const lat1 = a.latitude * d2r;
  const lat2 = b.latitude * d2r;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * r * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const scorePair = (a, b) => {
  let score = 0;

  if (a.category && a.category === b.category) score += 0.2;
  if (a.campus && a.campus === b.campus) score += 0.1;

  score += overlap(a.title, b.title) * 0.4;
  score += overlap(a.description, b.description) * 0.2;

  const distance = distanceKm(a.location, b.location);
  if (distance <= 0.5) score += 0.1;

  return Number(Math.min(1, score).toFixed(2));
};

module.exports = { scorePair };
