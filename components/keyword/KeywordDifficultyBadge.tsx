import { Badge } from '@/components/ui/badge';

interface KeywordDifficultyBadgeProps {
  difficulty: number;
}

const KeywordDifficultyBadge = ({ difficulty }: KeywordDifficultyBadgeProps) => {
  const getBadgeStyle = (difficulty: number): string => {
    if (difficulty <= 33) {
      return 'bg-green-100 text-green-700'; // Low Difficulty
    } else if (difficulty <= 50) {
      return 'bg-yellow-100 text-yellow-700'; // Medium Difficulty
    } else {
      return 'bg-red-100 text-red-700'; // High Difficulty
    }
  };

  return (
    <Badge variant="secondary" className={`rounded-full px-2 py-1 ${getBadgeStyle(difficulty)}`}>
      {difficulty <= 33 ? 'Low' : difficulty <= 50 ? 'Medium' : 'High'}
    </Badge>
  );
};

export default KeywordDifficultyBadge;
