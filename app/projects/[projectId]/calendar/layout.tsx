import React from 'react';
import { CalendarProvider } from '@/components/calendar/CalendarContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalendarProvider>{children}</CalendarProvider>;
}
