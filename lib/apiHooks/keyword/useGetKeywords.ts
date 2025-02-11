import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface Keyword {
  id: string;
  keyword: string;
  difficulty: number;
  // volume: number;
  // source: string;
  intent: string;
  trend: number[];
  // cpc: number;
  content_count: any;
  scheduled_content_count: any;
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
        .select(
          `id, keyword, difficulty, trend, intent, content_count:Content!fk_content_keyword(count), scheduled_content_count:ScheduledContent!ScheduledContent_keyword_id_fkey(count)`
        )
        .eq('project_id', projectId);

      if (error) {
        throw new Error(error.message || 'An error occurred while fetching keywords');
      }

      return data;
    },
    select: (data) =>
      data.map((k) => ({
        id: k.id,
        keyword: k.keyword,
        content_count: k.content_count,
        difficulty: k.difficulty,
        trend: k.trend,
        intent: k.intent,
        scheduled_content_count: k.scheduled_content_count,
      })),
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
};
