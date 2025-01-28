import { Badge } from '@/components/ui/badge';

interface CPCProps {
  cpc: number;
}

const getCPCBadgeStyle = (cpc: number): string => {
  if (cpc < 1) {
    return 'bg-green-100 text-green-700'; // Low CPC
  } else if (cpc >= 1 && cpc <= 3) {
    return 'bg-yellow-100 text-yellow-700'; // Medium CPC
  } else {
    return 'bg-red-100 text-red-700'; // High CPC
  }
};

const CostPerClickSEO = ({ cpc }: CPCProps) => {
  const badgeStyle = getCPCBadgeStyle(cpc);

  return (
    <Badge variant="secondary" className={`rounded-full px-2 py-1 ${badgeStyle}`}>
      {cpc < 1 ? 'Low' : cpc <= 3 ? 'Medium' : 'High'}
    </Badge>
  );
};

export default CostPerClickSEO;
