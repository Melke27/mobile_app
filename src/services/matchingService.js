import { calculateMatchScore } from '../utils/matchScore';

const getId = (item) => item?._id || item?.id;

export const matchingService = {
  findPotentialMatches(targetItem, candidates, threshold = 0.55) {
    const targetId = getId(targetItem);

    return candidates
      .filter((candidate) => getId(candidate) !== targetId)
      .map((candidate) => ({
        item: candidate,
        score: calculateMatchScore(targetItem, candidate),
      }))
      .filter((result) => result.score >= threshold)
      .sort((a, b) => b.score - a.score);
  },
};
