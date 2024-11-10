import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import useInfiniteScroll from "react-infinite-scroll-hook";

interface CardViewProps {
  items: Array<{
    id: number;
    title: string;
    updated_at: string;
    status: string;
    keywords?: string[];
    image_url?: string;
  }>;
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export function CardView({
  items,
  loading,
  hasNextPage,
  onLoadMore,
}: CardViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const sortedItems = [...items].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    disabled: false,
    rootMargin: "0px 0px 400px 0px",
  });

  const handleCardClick = (contentId: number) => {
    router.push(`/content/${contentId}?projectId=${projectId}`);
  };

  const DEFAULT_IMAGE = "https://picsum.photos/seed/default/800/600";

  // Base64 encoded tiny placeholder image
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR0hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {sortedItems.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:shadow-xl transition-shadow bg-white flex flex-col"
          onClick={() => handleCardClick(item.id)}
        >
          <CardHeader className="p-0 relative">
            <div className="absolute top-4 right-5 left-4 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-500">
                {item.status}
              </span>
              <span className="text-white p-1 bg-indigo-400 rounded-md">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 mt-10 flex-grow flex flex-col">
            <CardTitle className="text-gray-700 text-base mb-2 line-clamp-2">
              {item.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {item.keywords?.map((keyword, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="my-1 bg-indigo-50 text-indigo-700 px-2 py-0 h-5 hover:bg-indigo-100 text-xs w-fit"
                >
                  {keyword}
                </Button>
              ))}
            </div>
          </CardContent>
          <div className="relative h-40">
            <Image
              src={item.image_url || DEFAULT_IMAGE}
              alt={item.title}
              layout="fill"
              objectFit="cover"
              className="rounded-b-lg"
              placeholder="blur"
              blurDataURL={blurDataURL}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_IMAGE;
              }}
            />
          </div>
          <div className="border-t" />
          <div className="bg-gray-100 p-3">
            <p className="text-xs text-gray-500 py-1">
              Last Updated{" "}
              <span className="font-bold text-black-lg">
                {new Date(item.updated_at).toLocaleDateString()}
              </span>
            </p>
          </div>
        </Card>
      ))}
      {hasNextPage && <div ref={sentryRef} />}
    </div>
  );
}
