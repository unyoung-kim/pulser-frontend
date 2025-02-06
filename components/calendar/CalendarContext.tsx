'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { toUTC } from '@/lib/utils/dateUtils';

interface CalendarContextType {
  currentDate: Date;
  createEvent: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onDateClick: (date: Date) => void;
  onEventClick: (event: ScheduledEvent) => void;
  initialEventTimes: Date | null;
  selectedEvent?: ScheduledEvent | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>;
}

export interface ScheduledEvent {
  id: string;
  topic: string;
  type: 'NORMAL' | 'GLOSSARY' | null;
  instruction: string;
  scheduled_time: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'FAILED_ERROR' | 'FAILED_USAGE_LIMIT' | null;
  keyword_id: string;
  project_id: string;
  // color: string;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [initialEventTimes, setInitialEventTimes] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(subMonths(currentDate, 1));
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(addMonths(currentDate, 1));
  }, [currentDate]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
    const time = new Date(date);
    setInitialEventTimes(toUTC(time));
  };

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(null);
    setInitialEventTimes(null);
    setIsEventDialogOpen(true);
  }, []);

  const handleEventClick = useCallback((event: ScheduledEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  }, []);

  const values = {
    currentDate,
    createEvent: handleAddEvent,
    onPreviousMonth: handlePreviousMonth,
    onNextMonth: handleNextMonth,
    onToday: handleToday,
    open: isEventDialogOpen,
    onOpenChange: setIsEventDialogOpen,
    onDateClick: handleDateClick,
    onEventClick: handleEventClick,
    initialEventTimes,
    selectedEvent,
    setSelectedEvent,
  };

  return <CalendarContext.Provider value={values}>{children}</CalendarContext.Provider>;
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
  return context;
};
