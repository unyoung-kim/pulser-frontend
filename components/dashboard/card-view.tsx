import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Case from "case";
import { MoreHorizontal, Trash } from "lucide-react";
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
    type?: string;
  }>;
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onDelete?: (id: number) => void;
}

export function CardView({
  items,
  loading,
  hasNextPage,
  onLoadMore,
  onDelete,
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

  const getValidImageUrl = (url?: string) => {
    if (!url || url === "/timeline-image-url" || url === "timeline-image-url") {
      return DEFAULT_IMAGE;
    }

    try {
      if (url.startsWith("http")) {
        return url;
      }

      const urlToTest = url.startsWith("/") ? url : `/${url}`;
      new URL(urlToTest, window.location.origin);
      return urlToTest;
    } catch {
      return DEFAULT_IMAGE;
    }
  };

  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR0hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedItems.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden bg-white hover:shadow-md transition-shadow"
          onClick={() => handleCardClick(item.id)}
        >
          <CardHeader className="p-4 space-y-0 mb-1">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  {Case.capital(item.status)}
                </Badge>
                {item.type && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-indigo-100"
                  >
                    {Case.capital(item.type)}
                  </Badge>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  {/* <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(item.id);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare?.(item.id);
                    }}
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(item.id);
                    }}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-semibold text-base line-clamp-2">
              {item.title}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.keywords?.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <Image
                src={getValidImageUrl(item.image_url)}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105"
                placeholder="blur"
                blurDataURL={blurDataURL}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_IMAGE;
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-3 border-t bg-gray-50/50">
            <p className="text-xs text-muted-foreground">
              Last Updated {new Date(item.updated_at).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      ))}
      {hasNextPage && <div ref={sentryRef} />}
    </div>
  );
}
