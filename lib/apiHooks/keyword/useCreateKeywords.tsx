import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export type KeywordData = {
  cpc: number;
  keyword: string;
  difficulty: number;
  volume: number;
  intent: 'COMMERCIAL' | 'INFORMATIONAL' | 'NAVIGATIONAL' | 'TRANSACTIONAL';
  trend: number[];
};

export const useCreateKeywords = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keywords: KeywordData[]) => {
      const keywordsToInsert = keywords.map((keyword) => ({
        project_id: projectId,
        keyword: keyword.keyword,
        cpc: parseFloat(keyword.cpc.toString()),
        difficulty: parseInt(keyword.difficulty.toString()),
        volume: parseInt(keyword.volume.toString()),
        intent: keyword.intent.toUpperCase(),
        trend: keyword.trend,
        source: 'PULSER',
      }));

      const { error, data } = await supabase
        .from('Keyword')
        .upsert(keywordsToInsert, {
          onConflict: 'project_id,keyword',
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords', projectId] });
      toast({
        title: '🎉 Success',
        description: 'Keywords saved successfully',
        icon: <Check className="h-6 w-6 text-green-500" />,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save keywords',
        variant: 'destructive',
      });
      console.error(error);
    },
  });
};
