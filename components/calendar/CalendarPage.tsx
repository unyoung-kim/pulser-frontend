import { CalendarGrid } from '@/components/calendar/calendar-grid';
import { CalendarHeader } from '@/components/calendar/calendar-header';
import { EventDialog } from '@/components/calendar/event-dialog';
import { Separator } from '@/components/ui/separator';

export default function CalendarPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Planner</h1>
          <p className="text-muted-foreground">
            Schedule your content creation and Pulser will generate the content for you.
          </p>
        </div>

        <Separator className="" />

        <div className="space-y-4">
          <CalendarHeader />
          <CalendarGrid />
          <EventDialog />
        </div>
      </div>
    </div>
  );
}
