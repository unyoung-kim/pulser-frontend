import { Grid, List, Settings2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
  view: 'cards' | 'table'
  setView: (view: 'cards' | 'table') => void
  status: string
  setStatus: (status: string) => void
}

export function ViewToggle({ view, setView, status, setStatus }: ViewToggleProps) {
  const statuses = ['All', 'draft', 'published', 'archived', 'scheduled']

  return (
    <div className="flex items-center justify-between h-6 mb-4">
      <div className="flex gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={status === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatus(s)}
            className={`${status === s ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-200" : "bg-white text-gray-500 hover:bg-indigo-50"} rounded-full text-sm`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>
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
          variant="outline"
          size="sm"
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full text-sm"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>
    </div>
  )
}
