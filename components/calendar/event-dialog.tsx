'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCalendar } from '@/components/calendar/CalendarContext';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea2';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start: z.string(),
  end: z.string(),
  description: z.string().optional(),
  content: z.enum(['SEO', 'Digital Marketing', 'Content Writing', 'Social Media']),
  color: z.string(),
});

export function EventDialog() {
  const { initialEventTimes, event, open, onOpenChange, onSubmit, onDelete } = useCalendar();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      start: new Date().toISOString().slice(0, 16),
      end: new Date().toISOString().slice(0, 16),
      description: '',
      content: 'SEO',
      color: '#2563eb',
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        start: event.start.toISOString().slice(0, 16),
        end: event.end.toISOString().slice(0, 16),
        description: event.description || '',
        content: event.content,
        color: event.color || '#2563eb',
      });
    } else if (initialEventTimes) {
      form.reset({
        ...form.getValues(),
        start: initialEventTimes.start.toISOString().slice(0, 16),
        end: initialEventTimes.end.toISOString().slice(0, 16),
      });
    } else {
      form.reset({
        title: '',
        start: new Date().toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16),
        description: '',
        content: 'SEO',
        color: '#2563eb',
      });
    }
  }, [event, initialEventTimes, form]);

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(event ? { ...data, id: event.id } : data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SEO">SEO</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="Content Writing">Content Writing</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              {event && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <div className="ml-auto space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">{event ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
