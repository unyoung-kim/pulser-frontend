import Image from "next/image"
import { Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useInfiniteScroll from 'react-infinite-scroll-hook'

interface CardViewProps {
  items: Array<{
    id: number
    title: string
    updated_at: string
    status: string
  }>
  loading: boolean
  hasNextPage: boolean
  onLoadMore: () => void
}

export function CardView({ items, loading, hasNextPage, onLoadMore }: CardViewProps) {
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    // Only call onLoadMore once at a time
    disabled: false,
    // Root margin to start loading more a little before the viewport reaches the bottom
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:shadow-xl transition-shadow bg-white">
          <CardHeader className="p-0 relative">
            <div className="absolute top-4 right-5 left-4 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-500">{item.status}</span>
              <span className="text-white p-1 bg-indigo-400 rounded-md">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 mt-10">
            <CardTitle className="text-gray-700 text-base">{item.title}</CardTitle>
            <Button variant="ghost" className="my-3 bg-indigo-50 text-indigo-700 px-2 py-0 h-5 hover:bg-indigo-100 text-xs">Text</Button>
          </CardContent>
          <Image src={`https://picsum.photos/seed/${item.id}/200/200`} alt={item.title} width={200} height={200} className="w-full h-40 object-cover rounded-t-lg" />
          <div className="border-t" />
          <div className="bg-gray-100 p-3">
            <p className="text-xs text-gray-500 py-1">Last Updated <span className="font-bold text-black-lg">{new Date(item.updated_at).toLocaleDateString()}</span></p>
            <p className="text-xs text-gray-500 py-1">Status <span className="font-bold text-black-lg">{item.status}</span></p>
          </div>
        </Card>
      ))}
      {(loading || hasNextPage) && (
        <div ref={sentryRef} className="col-span-full flex justify-center p-4">
          <span className="text-gray-500">Loading more...</span>
        </div>
      )}
    </div>
  )
}
