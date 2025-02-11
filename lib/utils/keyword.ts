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

export const keywordDifficultyBadgeClass = (competition: number): string => {
  return competition <= 30
    ? 'bg-green-100 text-green-700'
    : competition <= 60
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';
};

export const intentBadgeClass = (intent: string): string => {
  switch (intent) {
    case 'Commercial':
      return 'bg-blue-100 text-blue-700';
    case 'Informational':
      return 'bg-green-100 text-green-700';
    case 'Transactional':
      return 'bg-yellow-100 text-yellow-700';
    case 'Navigational':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const trendData = (data: string[]) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    value: Number(data[i]) * 100,
  }));
};

export const filterKeywords = (keywords: Array<any>, type: 'used' | 'unused' | 'scheduled') => {
  switch (type) {
    case 'used':
      return (
        keywords
          .filter(
            (k) => k.content_count.at(0)?.count > 0 && k.scheduled_content_count.at(0)?.count === 0
          )
          .map((k) => ({ label: k.keyword, value: k.id })) ?? []
      );

    case 'unused':
      return (
        keywords
          .filter(
            (k) =>
              k.content_count.at(0)?.count === 0 && k.scheduled_content_count.at(0)?.count === 0
          )
          .map((k) => ({ label: k.keyword, value: k.id })) ?? []
      );

    case 'scheduled':
      return (
        keywords
          .filter(
            (k) => k.scheduled_content_count.at(0)?.count > 0 && k.content_count.at(0)?.count === 0
          )
          .map((k) => ({ label: k.keyword, value: k.id })) ?? []
      );

    default:
      return [];
  }
};
