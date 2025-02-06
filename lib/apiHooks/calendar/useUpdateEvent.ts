import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ScheduledEvent } from '@/components/calendar/CalendarContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const useUpdateEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedEvent: ScheduledEvent) => {
      const { data, error } = await supabase
        .from('ScheduledContent')
        .update(updatedEvent)
        .eq('id', updatedEvent.id);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your event has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to update the event.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getScheduledContent'] });
    },
  });
};
