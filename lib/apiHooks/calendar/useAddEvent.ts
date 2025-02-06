import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ScheduledEvent } from '@/components/calendar/CalendarContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const useAddEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: Omit<ScheduledEvent, 'id'>) => {
      const { data, error } = await supabase.from('ScheduledContent').insert(newEvent).single(); // Assumes the insert returns a single object

      if (error) {
        throw new Error(error.message || 'An error occurred while adding the event');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Content scheduled successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to schedule content.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getScheduledContent'] });
    },
  });
};
