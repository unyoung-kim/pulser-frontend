import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface Keyword {
  id: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  keyword: string;
  difficulty: number;
  volume: number;
  source: string;
  intent: string;
  trend: number[];
  cpc: number;
}

export const useGetKeywords = (projectId: string | null | undefined) => {
  return useQuery<Keyword[], Error>({
    queryKey: ['getKeywords', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const { data, error } = await supabase
        .from('Keyword')
        .select('*')
        .eq('project_id', projectId);

      if (error) {
        throw new Error(error.message || 'An error occurred while fetching keywords');
      }

      return mapKeywordData(data);
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
};

// Optional: Map data for consistency, in case you want to modify or transform certain fields
const mapKeywordData = (data: Keyword[] | null): Keyword[] => {
  return (
    data?.map((item) => ({
      ...item,
      trend: item.trend || [],
    })) || []
  );
};
