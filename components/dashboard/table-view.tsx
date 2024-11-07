import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { format } from 'date-fns'
import { useCallback } from 'react'
import Image from "next/image"
import { useRouter, useSearchParams } from 'next/navigation';

interface TableViewProps {
  items: Array<{
    id: number
    title: string
    status: string
    updated_at: string
    created_at: string
    image_url: string
    keywords?: string[]
    description?: string
    date?: string
    type?: string
    tags?: string[]
  }>
  loading: boolean
  hasNextPage: boolean
  onLoadMore: () => void
}

const DEFAULT_IMAGE = 'https://picsum.photos/seed/default/100/100';

export function TableView({ items, loading, hasNextPage, onLoadMore }: TableViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    disabled: false,
    rootMargin: '0px 0px 400px 0px',
  });

  const handleRowClick = (contentId: number) => {
    router.push(`/content/${contentId}?projectId=${projectId}`);
  };

  const formatDate = useCallback((dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd hh:mm a')
  }, []);

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">Keywords</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">Updated At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={item.image_url || DEFAULT_IMAGE}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {item.keywords?.map((keyword, index) => (
                        <Button 
                          key={index}
                          variant="ghost" 
                          className="bg-indigo-50 text-indigo-700 px-2 py-0 h-5 hover:bg-indigo-100 text-xs"
                        >
                          {keyword}
                        </Button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={item.status === 'Scheduled' ? 'default' : 'secondary'} className="text-xs bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasNextPage && <div ref={sentryRef} />}
        </div>
      </div>
    </div>
  )
}
