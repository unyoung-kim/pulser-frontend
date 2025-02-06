import { useQuery } from '@tanstack/react-query';
import { ScheduledEvent } from '@/components/calendar/CalendarContext';
import { supabase } from '@/lib/supabaseClient';

// Use Query to get all events for a specific project ID
export const useGetEvents = (projectId: string | null | undefined) => {
  return useQuery<ScheduledEvent[], Error>({
    queryKey: ['getScheduledContent', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('No Project ID found'); // Handle missing projectId gracefully
      }

      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('ScheduledContent')
        .select('*')
        .eq('project_id', projectId);

      if (error) {
        throw new Error(error.message || 'Failed to fetch events');
      }

      return mapEventData(data);
    },
    enabled: !!projectId, // Only fetch if projectId exists
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });
};

// Map the data to ensure consistent structure
const mapEventData = (data: ScheduledEvent[] | null): ScheduledEvent[] => {
  return (
    data?.map((item) => ({
      id: item.id || '',
      topic: item.topic || '',
      type: item.type || 'NORMAL',
      instruction: item.instruction || '',
      scheduled_time: item.scheduled_time || '',
      status: item.status || 'SCHEDULED',
      keyword_id: item.keyword_id || '',
      project_id: item.project_id || '',
      // Optional fields can be added here
      // color: item.color || '',
    })) || []
  );
};
