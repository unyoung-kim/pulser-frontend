'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { motion } from 'framer-motion';
import { ScheduledEvent, useCalendar } from '@/components/calendar/CalendarContext';
import { useGetEvents } from '@/lib/apiHooks/calendar/useGetEvents';
import { useUpdateEvent } from '@/lib/apiHooks/calendar/useUpdateEvent';
import { cn } from '@/lib/utils';
import { getWeekDays, toUTC } from '@/lib/utils/dateUtils';

export function CalendarGrid({}) {
  const { currentDate, onEventClick, onDateClick } = useCalendar();

  const { projectId } = useParams();
  const { data: scheduledEvents, isSuccess } = useGetEvents(projectId as string);
  const { mutate: updateEvent } = useUpdateEvent();

  const [draggedEvent, setDraggedEvent] = useState<ScheduledEvent | null>(null);
  const dragCounter = useRef(0);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const handleDragStart = (event: ScheduledEvent, e: any) => {
    setDraggedEvent(event);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date, e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;

    if (draggedEvent) {
      // Convert both dates to UTC to avoid any time zone issues
      const draggedEventTime = toUTC(new Date(draggedEvent.scheduled_time));
      const dropDateTime = toUTC(date);

      // Calculate the time difference between the original event time and the drop date
      const diffTime = dropDateTime.getTime() - draggedEventTime.getTime();

      updateEvent({
        ...draggedEvent,
        scheduled_time: new Date(draggedEventTime.getTime() + diffTime).toISOString(),
      });

      setDraggedEvent(null);
    }
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  if (isSuccess) {
    return (
      <div className="grid grid-cols-7 border-l border-t">
        {getWeekDays().map((day) => (
          <div
            key={day}
            className="border-b border-r p-4 text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          const dayEvents = scheduledEvents.filter((event) =>
            isSameDay(event.scheduled_time, date)
          );
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());

          return (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={cn(
                'relative min-h-[120px] border-b border-r bg-white/40 p-2',
                !isCurrentMonth && 'bg-muted/5'
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(date, e)}
              onClick={() => {
                if (isCurrentMonth) {
                  onDateClick(date);
                } else {
                  return;
                }
              }}
            >
              <span
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm',
                  isToday && 'bg-indigo-600 text-white',
                  !isToday && !isCurrentMonth && 'text-muted-foreground'
                )}
              >
                {format(date, 'd')}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    layoutId={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(event, e)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={cn(
                      'cursor-pointer rounded-sm bg-muted/50 p-1.5 text-xs',
                      'transition-colors hover:bg-muted active:bg-muted/70',
                      'flex items-center gap-2',
                      draggedEvent?.id === event.id && 'opacity-50'
                    )}
                  >
                    <div
                      className="h-4 w-1 rounded-full"
                      style={{ backgroundColor: getRandomColor() }}
                    />
                    <span className="truncate">{event.topic}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }
  return <div>Loading...</div>;
}
