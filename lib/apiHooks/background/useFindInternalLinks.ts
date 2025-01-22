import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { internalLinksUrl } from '@/constants/urlConstant';
import { useToast } from '@/hooks/use-toast';

export const useFindInternalLinks = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(internalLinksUrl, {
          projectId,
        });

        return response.data; // Axios automatically parses JSON responses
      } catch (error) {
        throw new Error('Failed to find internal links');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalLinks', projectId] });
      toast({
        title: '🎉 Success',
        description: 'Internal links found successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to find internal links',
        variant: 'destructive',
      });
    },
  });
};
