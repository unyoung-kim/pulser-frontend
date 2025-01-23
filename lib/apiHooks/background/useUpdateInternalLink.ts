import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const useUpdateInternalLink = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, url, summary }: { id: string; url: string; summary: string }) => {
      const { data, error } = await supabase
        .from('InternalLink')
        .update({ url, summary })
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalLinks', projectId] });
      toast({
        title: '🎉 Success',
        description: 'Internal link updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update internal link',
        variant: 'destructive',
      });
    },
  });
};
