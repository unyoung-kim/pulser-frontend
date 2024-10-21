import { Badge } from "@/components/ui/badge"
import useInfiniteScroll from 'react-infinite-scroll-hook'

interface TableViewProps {
  items: Array<{
    id: number
    title: string
    status: string
    updated_at: string
    // Make these properties optional
    description?: string
    date?: string
    type?: string
    tags?: string[]
  }>
  loading?: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
}

export function TableView({ items, loading, hasNextPage, onLoadMore }: TableViewProps) {
  const [sentryRef] = useInfiniteScroll({
    loading: loading || false,
    hasNextPage: hasNextPage || false,
    onLoadMore: onLoadMore || (() => {}),
    disabled: false,
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={item.status === 'Scheduled' ? 'default' : 'secondary'} className="text-xs bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer">
                  {item.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(loading || hasNextPage) && (
        <div ref={sentryRef} className="flex justify-center p-4">
          <span className="text-gray-500">Loading more...</span>
        </div>
      )}
    </div>
  )
}
