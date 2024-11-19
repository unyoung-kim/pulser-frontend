import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";

interface TableViewProps {
  items: Array<{
    id: number;
    title: string;
    status: string;
    updated_at: string;
    created_at: string;
    image_url: string;
    keywords?: string[];
    description?: string;
    date?: string;
    type?: string;
    tags?: string[];
  }>;
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

const DEFAULT_IMAGE = "https://picsum.photos/seed/default/100/100";

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

export function TableView({
  items,
  loading,
  hasNextPage,
  onLoadMore,
}: TableViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    disabled: false,
    rootMargin: "0px 0px 400px 0px",
  });

  const handleRowClick = useCallback(
    (contentId: number) => {
      router.push(`/content/${contentId}?projectId=${projectId}`);
    },
    [router, projectId]
  );

  const formatDate = useCallback((dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd hh:mm a");
  }, []);

  return (
    <div className="mt-6 flow-root">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="h-16">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[180px]">Created At</TableHead>
              <TableHead className="w-[180px]">Updated At</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="group h-24">
                <TableCell className="py-4">
                  <Checkbox />
                </TableCell>
                <TableCell className="py-4">
                  <Image
                    src={getValidImageUrl(item.image_url)}
                    alt={item.title}
                    width={120}
                    height={68}
                    className="rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium py-4">
                  <div className="text-base">{item.title}</div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-2">
                    {item.keywords?.map((keyword, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="bg-indigo-50 text-indigo-700 px-3 py-1 h-7 hover:bg-indigo-100 text-sm"
                      >
                        {keyword}
                      </Button>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(item.updated_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={() => handleRowClick(item.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Make a copy</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {hasNextPage && <div ref={sentryRef} />}
      </div>
    </div>
  );
}
