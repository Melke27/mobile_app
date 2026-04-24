const tokenize = (text = '') =>
  text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

const overlapScore = (aText, bText) => {
  const a = new Set(tokenize(aText));
  const b = new Set(tokenize(bText));

  if (!a.size || !b.size) {
    return 0;
  }

  let overlap = 0;
  a.forEach((token) => {
    if (b.has(token)) {
      overlap += 1;
    }
  });

  return overlap / Math.max(a.size, b.size);
};

const distanceKm = (a, b) => {
  if (!a || !b) {
    return 999;
  }

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

export const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;

  if (lostItem.category === foundItem.category) {
    score += 0.25;
  }

  const titleSimilarity = overlapScore(lostItem.title, foundItem.title);
  const descriptionSimilarity = overlapScore(lostItem.description, foundItem.description);
  score += titleSimilarity * 0.4;
  score += descriptionSimilarity * 0.2;

  const locationDistance = distanceKm(lostItem.location, foundItem.location);
  if (locationDistance <= 0.5) {
    score += 0.15;
  } else if (locationDistance <= 2) {
    score += 0.08;
  }

  return Number(Math.min(1, score).toFixed(2));
};
