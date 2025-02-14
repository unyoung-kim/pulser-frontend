'use client';

import { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, FileText, MessageSquare, Tag, TrashIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCalendar } from '@/components/calendar/CalendarContext';
import KeywordSelector from '@/components/content/KeywordInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateTimePicker24h } from '@/components/ui/DateTimePicker24h';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea2';
import { useAddEvent } from '@/lib/apiHooks/calendar/useAddEvent';
import { useDeleteEvent } from '@/lib/apiHooks/calendar/useDeleteEvent';
import { useUpdateEvent } from '@/lib/apiHooks/calendar/useUpdateEvent';
import { useCreateKeywords } from '@/lib/apiHooks/keyword/useCreateKeywords';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/lib/utils/calendarUtils';
import { DateUTC } from '@/lib/utils/dateUtils';

const formSchema = z.object({
  topic: z.string().default(''),
  scheduled_time: z.date(),
  instruction: z.string().default(''),
  keyword_id: z.string(),
});

export function EventDialog() {
  const { projectId } = useParams() as { projectId: string };
  const { mutate: addEvent } = useAddEvent();
  const { mutate: updateEvent } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();

  const { initialEventTimes, selectedEvent, setSelectedEvent, open, onOpenChange } = useCalendar();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      scheduled_time: new Date(),
      instruction: '',
      keyword_id: '',
    },
  });

  useEffect(() => {
    if (selectedEvent) {
      form.reset({
        topic: selectedEvent.topic,
        scheduled_time: new Date(selectedEvent.scheduled_time),
        instruction: selectedEvent.instruction || '',
        keyword_id: selectedEvent.keyword_id,
      });
    } else if (initialEventTimes) {
      form.reset({
        topic: '',
        scheduled_time: new Date(initialEventTimes),
        instruction: '',
        keyword_id: '',
      });
    } else {
      form.reset({
        topic: '',
        scheduled_time: new Date(),
        instruction: '',
        keyword_id: '',
      });
    }
  }, [selectedEvent, initialEventTimes, form]);

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleEventDelete = useCallback(() => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      onOpenChange(false);
      setSelectedEvent(null);
    }
  }, [deleteEvent, onOpenChange, selectedEvent, setSelectedEvent]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedEvent) {
      updateEvent({
        ...data,
        project_id: projectId,
        id: selectedEvent.id,
        type: 'NORMAL',
        scheduled_time: DateUTC(data.scheduled_time),
      });
    } else {
      addEvent({
        ...data,
        project_id: projectId,
        instruction: data.instruction || '',
        type: 'NORMAL',
        scheduled_time: DateUTC(data.scheduled_time),
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <DialogTitle className="text-2xl font-semibold">
              {selectedEvent ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
            {selectedEvent?.status && (
              <Badge
                className={cn(
                  getStatusColor(selectedEvent?.status as string),
                  'px-2 py-1 font-medium capitalize'
                )}
              >
                {selectedEvent?.status?.toLowerCase()}
              </Badge>
            )}
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="keyword_id"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-indigo-600" />
                      Keyword
                    </FormLabel>
                    <FormControl>
                      <KeywordSelector
                        selectedKeyword={field.value}
                        onKeywordChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduled_time"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <CalendarIcon className="h-4 w-4 text-indigo-600" />
                      Date & Time
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker24h value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4 text-indigo-600" />
                    Topic (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full border-indigo-100 focus-visible:ring-indigo-600"
                      placeholder="Include the exact keyword in your topic"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instruction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    Instructions / Outline (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px] border-indigo-100 focus-visible:ring-indigo-600"
                      placeholder="Optional: Add specific instructions or outline for the content..."
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Add any specific requirements or outline for the content structure
                  </p>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between pt-4">
              {selectedEvent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEventDelete}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                  disabled={selectedEvent?.status === 'COMPLETED'}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <div className="ml-auto space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={selectedEvent?.status === 'COMPLETED'}
                >
                  {selectedEvent ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
