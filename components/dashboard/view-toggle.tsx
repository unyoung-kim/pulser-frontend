import { Grid, List, Settings2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Case from 'case'

export enum Status {
  All = 'All',
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
  Scheduled = 'scheduled',
}

interface ViewToggleProps {
  view: 'cards' | 'table'
  setView: (view: 'cards' | 'table') => void
  status: Status
  setStatus: (status: string) => void
  onNewContent: () => void
}

export function ViewToggle({ view, setView, status, setStatus, onNewContent }: ViewToggleProps) {
  const statuses = Object.values(Status)

  return (
    <div className="flex items-center justify-between h-6 mb-4">
      <Tabs value={status} onValueChange={(value) => setStatus(value)} className="w-auto">
        <TabsList>
          {statuses.map((s) => (
            <TabsTrigger key={s} value={s} className="text-sm">
              {Case.capital(s)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex gap-2 ml-auto">
        <Button
          variant={view === 'cards' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('cards')}
          className={`${view === 'cards' ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-200" : "bg-white text-gray-500 hover:bg-indigo-50"} rounded-full text-sm`}
        >
          <Grid className="h-4 w-4 mr-2" />
          Cards
        </Button>
        <Button
          variant={view === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('table')}
          className={`${view === 'table' ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-200" : "bg-white text-gray-500 hover:bg-indigo-50"} rounded-full text-sm`}
        >
          <List className="h-4 w-4 mr-2" />
          Table
        </Button>
      </div>
      <div className="flex gap-2 ml-2">
        <Button
          variant="default"
          size="sm"
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full text-sm"
          onClick={onNewContent}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>
    </div>
  )
}
