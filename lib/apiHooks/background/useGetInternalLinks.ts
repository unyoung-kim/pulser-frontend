import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const useGetInternalLinks = (projectId: string) => {
  return useQuery({
    queryKey: ['internalLinks', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('InternalLink')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
  });
};
