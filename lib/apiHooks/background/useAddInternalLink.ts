import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const useAddInternalLink = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, summary }: { url: string; summary: string }) => {
      const { data, error } = await supabase
        .from('InternalLink')
        .insert({ project_id: projectId, url, summary })
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalLinks', projectId] });
      toast({
        title: '🎉 Success',
        description: 'Internal link added successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add internal link',
        variant: 'destructive',
      });
    },
  });
};
