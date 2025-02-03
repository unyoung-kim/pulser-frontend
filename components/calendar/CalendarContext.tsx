'use client';

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { addMonths, parseISO, subMonths } from 'date-fns';
import { toUTC } from '@/lib/utils/dateUtils';

interface CalendarContextType {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  createEvent: () => void;
  updateEvent: (id: string, updatedEvent: any) => void;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  initialEventTimes: { start: Date; end: Date } | null;
  event?: CalendarEvent;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: any) => void;
  onDelete: () => void;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  content: 'SEO' | 'Digital Marketing' | 'Content Writing' | 'Social Media';
  color?: string;
}

interface CalendarState {
  currentDate: Date;
  events: CalendarEvent[];
}

type CalendarAction =
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'ADD_EVENT'; payload: Omit<CalendarEvent, 'id'> }
  | { type: 'UPDATE_EVENT'; payload: { id: string; updatedEvent: Partial<CalendarEvent> } }
  | { type: 'DELETE_EVENT'; payload: string };

const initialState: CalendarState = {
  currentDate: new Date(),
  events: [],
};

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: new Date(action.payload) };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, { ...action.payload, id: crypto.randomUUID() }],
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? { ...event, ...action.payload.updatedEvent } : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    default:
      return state;
  }
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [initialEventTimes, setInitialEventTimes] = useState<{ start: Date; end: Date } | null>(
    null
  );
  const [state, dispatch] = useReducer(calendarReducer, initialState, (initial) => {
    const storedData = localStorage.getItem('calendar-storage');
    return storedData
      ? {
          ...initial,
          ...JSON.parse(storedData),
          currentDate: new Date(JSON.parse(storedData).currentDate),
          events: JSON.parse(storedData).events.map((event: any) => ({
            ...event,
            start: parseISO(event.start),
            end: parseISO(event.end),
          })),
        }
      : initial;
  });

  useEffect(() => {
    localStorage.setItem(
      'calendar-storage',
      JSON.stringify({
        ...state,
        events: state.events.map((event) => ({
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString(),
        })),
      })
    );
  }, [state, state.events]);

  const handlePreviousMonth = useCallback(() => {
    dispatch({
      type: 'SET_CURRENT_DATE',
      payload: subMonths(state.currentDate, 1),
    });
  }, [dispatch, state.currentDate]);

  const handleNextMonth = useCallback(() => {
    dispatch({
      type: 'SET_CURRENT_DATE',
      payload: addMonths(state.currentDate, 1),
    });
  }, [dispatch, state.currentDate]);

  const handleToday = useCallback(() => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  }, [dispatch]);

  const handleDateClick = (date: Date) => {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
    const startTime = new Date(date.setHours(9, 0, 0, 0));
    const endTime = new Date(date.setHours(10, 0, 0, 0));
    setInitialEventTimes({ start: toUTC(startTime), end: toUTC(endTime) });
  };

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(null);
    setInitialEventTimes(null);
    setIsEventDialogOpen(true);
  }, []);

  const handleUpdateEvent = useCallback((id: any, updatedEvent: any) => {
    dispatch({
      type: 'UPDATE_EVENT',
      payload: { id, updatedEvent },
    });
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  }, []);

  const handleEventSubmit = useCallback(
    (data: any) => {
      const eventData = {
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
      };

      if (selectedEvent) {
        dispatch({
          type: 'UPDATE_EVENT',
          payload: { id: selectedEvent.id, updatedEvent: eventData },
        });
      } else {
        dispatch({ type: 'ADD_EVENT', payload: eventData });
      }
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    },
    [dispatch, selectedEvent]
  );

  const handleEventDelete = useCallback(() => {
    if (selectedEvent) {
      dispatch({ type: 'DELETE_EVENT', payload: selectedEvent.id });
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    }
  }, [dispatch, selectedEvent]);

  const values = {
    state,
    dispatch,
    onPreviousMonth: handlePreviousMonth,
    onNextMonth: handleNextMonth,
    onToday: handleToday,
    createEvent: handleAddEvent,
    updateEvent: handleUpdateEvent,
    onDateClick: handleDateClick,
    onEventClick: handleEventClick,
    initialEventTimes,
    event: selectedEvent || undefined,
    open: isEventDialogOpen,
    onOpenChange: setIsEventDialogOpen,
    onSubmit: handleEventSubmit,
    onDelete: handleEventDelete,
  };

  return <CalendarContext.Provider value={values}>{children}</CalendarContext.Provider>;
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
  return context;
};
