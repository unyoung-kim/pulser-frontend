export const searchVolumeCaption = (searchVolume: number) => {
  if (searchVolume > 100000) {
    return `High demand, Highly competitive.`;
  } else if (searchVolume > 50000) {
    return `Moderate demand, Competitive.`;
  } else {
    return `Low demand, Less competitive.`;
  }
};

export const keywordDifficultyCaption = (difficulty: number) => {
  if (difficulty <= 33) {
    return 'Easy to rank for, less competition';
  } else if (difficulty <= 50) {
    return 'Moderate difficulty, moderate competition';
  } else {
    return 'Hard to rank for, high competition';
  }
};

export const cpcCaption = (cpc: number) => {
  if (cpc < 1) {
    return 'Low CPC, cost-effective to advertise';
  } else if (cpc >= 1 && cpc <= 3) {
    return 'Moderate CPC, balanced advertising cost';
  } else {
    return 'High CPC, expensive to advertise';
  }
};
