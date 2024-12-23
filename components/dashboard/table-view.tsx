import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import Case from "case";
import { format } from "date-fns";
import {
  ActivitySquare,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  FileType2,
  MoreHorizontal,
  Search,
  Tag,
  Trash2,
  Type,
} from "lucide-react";
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
    description?: string;
    date?: string;
    type?: string;
    tags?: string[];
    keyword?: string; // Add this line
  }>;
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onDelete: (id: number) => void;
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
  onDelete,
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
    return format(new Date(dateString), "MM/dd/yyyy");
  }, []);

  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === "draft") {
      return (
        <Badge
          variant="secondary"
          className="w-24 justify-center bg-indigo-100 text-indigo-600 inline-flex items-center gap-1"
        >
          <FileText className="h-3 w-3" />
          Draft
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="w-24 justify-center bg-green-100 text-green-700 inline-flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          Published
        </Badge>
      );
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="rounded-lg border-gray-200 border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 rounded-t-lg [&>*:first-child]:rounded-tl-lg [&>*:last-child]:rounded-tr-lg hover:bg-gray-100">
              <TableHead className="w-[300px] font-[550] text-gray-900">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-gray-900" />
                  Title
                </div>
              </TableHead>
              <TableHead className="font-[550] text-gray-900">
                <div className="flex items-center gap-2">
                  <FileType2 className="h-4 w-4 text-gray-900" />
                  Type
                </div>
              </TableHead>
              <TableHead className="font-[550] text-gray-900">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-900" />
                  Keyword
                </div>
              </TableHead>
              <TableHead className="font-[550] text-gray-900">
                <div className="flex items-center gap-2">
                  <ActivitySquare className="h-4 w-4 text-gray-900" />
                  Status
                </div>
              </TableHead>
              <TableHead className="font-[550] text-gray-900">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-900" />
                  Updated
                </div>
              </TableHead>
              <TableHead className="text-right font-[550] text-gray-900"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer border-b border-b-gray-200 hover:bg-gray-50"
                onClick={() => handleRowClick(item.id)}
              >
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  {item.type && (
                    <Badge
                      variant="outline"
                      className="w-24 justify-center inline-flex items-center gap-1"
                    >
                      {item.type.toLowerCase() === "normal" ? (
                        <>
                          <Search className="h-3 w-3" />
                          SEO
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-3 w-3" />
                          {Case.capital(item.type)}
                        </>
                      )}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-xs justify-start w-32 group relative"
                  >
                    <span className="line-clamp-2 block">{item.keyword}</span>
                    <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {item.keyword}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-gray-600 font-medium">
                  {formatDate(item.updated_at)}
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
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
