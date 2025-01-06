import Case from 'case';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export enum Status {
  All = 'All',
  Draft = 'draft',
  Published = 'published',
  // Archived = "archived",
  // Scheduled = "scheduled",
}

interface ViewToggleProps {
  view: 'cards' | 'table';
  // setView: (view: "cards" | "table") => void;
  status: Status;
  setStatus: (status: string) => void;
  onNewContent: () => void;
}

export function ViewToggle({
  view,
  // setView,
  status,
  setStatus,
  onNewContent,
}: ViewToggleProps) {
  const statuses: Status[] = Object.values(Status);

  return (
    <div className="flex items-center justify-between h-6 mb-4">
      <Tabs value={status} onValueChange={(value) => setStatus(value)} className="w-auto">
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          {statuses.map((s) => (
            <TabsTrigger key={s} value={s} className="text-sm">
              {Case.capital(s)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* <div className="flex gap-2 ml-auto">
        <Button
          variant={view === "cards" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("cards")}
          className={`${
            view === "cards"
              ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-200"
              : "bg-white text-gray-500 hover:bg-indigo-50"
          } text-sm`}
        >
          <Grid className="h-4 w-4 mr-2" />
          Cards
        </Button>
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
          className={`${
            view === "table"
              ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-200"
              : "bg-white text-gray-500 hover:bg-indigo-50"
          }  text-sm`}
        >
          <List className="h-4 w-4 mr-2" />
          Table
        </Button>
      </div> */}
      <div className="flex gap-2 ml-2">
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={onNewContent}>
          <Plus className="w-4 h-4 mr-2" />
          New Content
        </Button>
      </div>
    </div>
  );
}
