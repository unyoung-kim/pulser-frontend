import { Badge } from "@/components/ui/badge"

interface TableViewProps {
  items: Array<{
    id: number
    title: string
    description: string
    date: string
    type: string
    status: string
    tags: string[]
  }>
}

export function TableView({ items }: TableViewProps) {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tags</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={item.status === 'Scheduled' ? 'default' : 'secondary'} className="text-xs bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer">
                  {item.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}