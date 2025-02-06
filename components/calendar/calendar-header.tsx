'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/components/calendar/CalendarContext';
import { Button } from '@/components/ui/button';

export function CalendarHeader() {
  const { currentDate, onPreviousMonth, onNextMonth, onToday, createEvent } = useCalendar();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 text-sm" onClick={onToday}>
            Today
          </Button>
          <div className="flex items-center rounded-lg border bg-background">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={onPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={onNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <motion.h2
            key={currentDate.toISOString()}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="ml-2 text-xl font-medium"
          >
            {format(currentDate, 'MMMM yyyy')}
          </motion.h2>
        </div>
      </div>
      <Button onClick={createEvent} className="bg-purple-600 hover:bg-purple-700">
        Add new
      </Button>
    </div>
  );
}
