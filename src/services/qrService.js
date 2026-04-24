export const qrService = {
  createOwnershipToken({ itemId, ownerId }) {
    return `lf:${itemId}:${ownerId}:${Date.now()}`;
  },

  parseOwnershipToken(token) {
    const [prefix, itemId, ownerId, issuedAt] = (token || '').split(':');
    if (prefix !== 'lf' || !itemId || !ownerId || !issuedAt) {
      return null;
    }

    return { itemId, ownerId, issuedAt: Number(issuedAt) };
  },
};
