'use client';

import { useParams, useRouter } from 'next/navigation';
import Case from 'case';
import { CheckCircle, FileText, MoreVertical } from 'lucide-react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface CardViewProps {
  items: Array<{
    id: number;
    title: string;
    status: string;
    type?: string;
    keywords?: string[];
    updated_at: string;
    created_at?: string;
  }>;
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onDelete?: (id: number) => void;
}

export function CardView({ items, loading, hasNextPage, onLoadMore, onDelete }: CardViewProps) {
  const router = useRouter();
  const { projectId } = useParams();

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    disabled: false,
    rootMargin: '0px 0px 400px 0px',
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const isPublished = status.toLowerCase() === 'published';

    if (!isPublished) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
          <FileText className="h-3 w-3" />
          {Case.capital(status)}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1 bg-indigo-100 text-indigo-700">
        <CheckCircle className="h-3 w-3" />
        {Case.capital(status)}
      </Badge>
    );
  };

  const handleCardClick = (contentId: number) => {
    router.push(`/projects/${projectId}/content/${contentId}`);
  };

  const sortedItems = [...items].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedItems.map((item) => (
        <Card
          key={item.id}
          className="flex flex-col transition-shadow hover:shadow-md"
          onClick={() => handleCardClick(item.id)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex gap-2">
              {getStatusBadge(item.status)}
              {item.type && <Badge variant="outline">{Case.capital(item.type)}</Badge>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item.id);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-grow">
            <h3 className="mb-4 text-lg font-semibold">{item.title}</h3>
            <div className="flex flex-wrap gap-2">
              {item.keywords?.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {Case.capital(keyword)}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start space-y-1 pt-4 text-sm text-muted-foreground">
            <p>Created: {formatDate(item.created_at || item.updated_at)}</p>
            <p>Updated: {formatDate(item.updated_at)}</p>
          </CardFooter>
        </Card>
      ))}
      {hasNextPage && <div ref={sentryRef} />}
    </div>
  );
}
