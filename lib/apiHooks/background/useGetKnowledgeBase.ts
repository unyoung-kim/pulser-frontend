import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const useGetKnowledgeBase = (projectId: string) => {
  // Query to fetch knowledge base
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Project')
        .select('background')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      return data;
    },
  });
};
