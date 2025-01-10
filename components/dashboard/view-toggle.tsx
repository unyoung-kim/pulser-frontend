import Case from 'case';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tooltip from '@/components/ui/tooltip';

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
  basicBackground?: boolean;
}

export function ViewToggle({
  view,
  // setView,
  status,
  setStatus,
  onNewContent,
  basicBackground,
}: ViewToggleProps) {
  const statuses: Status[] = Object.values(Status);
  return (
    <div className="mb-4 flex h-6 items-center justify-between">
      <Tabs value={status} onValueChange={(value) => setStatus(value)} className="w-auto">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
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
      <Tooltip
        content={
          basicBackground
            ? 'Complete the background details first before proceeding'
            : 'Create new content'
        }
        side="bottom"
      >
        <div className="ml-2 flex gap-2">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={onNewContent}
            disabled={basicBackground} // Disable button if background data is not present
          >
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}
