import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient'; // Assuming you're using Supabase

export const useDeleteEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data, error } = await supabase.from('ScheduledContent').delete().eq('id', eventId);

      if (error) {
        // Handle error
        throw new Error(error.message || 'Failed to delete event');
      }

      return data; // Return the deleted event data if necessary
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your event has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to delete event.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getScheduledContent'] });
    },
  });
};
