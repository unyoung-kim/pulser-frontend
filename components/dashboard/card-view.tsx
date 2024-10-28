import Image from "next/image"
import { Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { ClipLoader } from 'react-spinners'

interface CardViewProps {
  items: Array<{
    id: number
    title: string
    updated_at: string
    status: string
    keyword?: string // Make keyword optional
  }>
  loading: boolean
  hasNextPage: boolean
  onLoadMore: () => void
}

const dummyKeywords = [
  "AI", "Machine Learning", "Data Science", "Cloud Computing", 
  "Blockchain", "IoT", "Cybersecurity", "DevOps", "Big Data", "VR/AR"
];

export function CardView({ items, loading, hasNextPage, onLoadMore }: CardViewProps) {
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    disabled: false,
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:shadow-xl transition-shadow bg-white flex flex-col">
          <CardHeader className="p-0 relative">
            <div className="absolute top-4 right-5 left-4 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-500">{item.status}</span>
              <span className="text-white p-1 bg-indigo-400 rounded-md">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 mt-10 flex-grow flex flex-col">
            <CardTitle className="text-gray-700 text-base mb-2 line-clamp-2">{item.title}</CardTitle>
            <Button variant="ghost" className="my-3 bg-indigo-50 text-indigo-700 px-2 py-0 h-5 hover:bg-indigo-100 text-xs w-fit">
              {item.keyword || dummyKeywords[Math.floor(Math.random() * dummyKeywords.length)]}
            </Button>
          </CardContent>
          <div className="relative h-40">
            <Image 
              src={`https://picsum.photos/seed/${item.id}/200/200`} 
              alt={item.title} 
              layout="fill"
              objectFit="cover"
              className="rounded-b-lg"
            />
          </div>
          <div className="border-t" />
          <div className="bg-gray-100 p-3">
            <p className="text-xs text-gray-500 py-1">Last Updated <span className="font-bold text-black-lg">{new Date(item.updated_at).toLocaleDateString()}</span></p>
          </div>
        </Card>
      ))}
      {(loading || hasNextPage) && (
        <div ref={sentryRef} className="col-span-full flex justify-center p-4">
          <ClipLoader color="#4F46E5" loading={loading} size={30} />
        </div>
      )}
    </div>
  )
}
