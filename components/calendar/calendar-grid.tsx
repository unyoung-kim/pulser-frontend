'use client';

import { useRef, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarEvent, useCalendar } from '@/components/calendar/CalendarContext';
import { cn } from '@/lib/utils';
import { getWeekDays, toUTC } from '@/lib/utils/dateUtils';

export function CalendarGrid({}) {
  const { state, updateEvent, onEventClick, onDateClick } = useCalendar();
  const { currentDate, events } = state;

  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const dragCounter = useRef(0);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const handleDragStart = (event: CalendarEvent, e: any) => {
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
      const diffTime = toUTC(date).getTime() - toUTC(draggedEvent.start).getTime();
      updateEvent(draggedEvent.id, {
        start: new Date(toUTC(draggedEvent.start).getTime() + diffTime),
        end: new Date(toUTC(draggedEvent.end).getTime() + diffTime),
      });
      setDraggedEvent(null);
    }
  };

  return (
    <div className="grid grid-cols-7 border-l border-t">
      {getWeekDays().map((day) => (
        <div key={day} className="border-b border-r p-4 text-sm font-medium text-muted-foreground">
          {day}
        </div>
      ))}

      {days.map((date, index) => {
        const dayEvents = events.filter((event) => isSameDay(event.start, date));
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
            onClick={() => onDateClick(date)}
          >
            <span
              className={cn(
                'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm',
                isToday && 'bg-purple-600 text-white',
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
                    style={{ backgroundColor: event.color || '#2563eb' }}
                  />
                  <span className="truncate">{event.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
