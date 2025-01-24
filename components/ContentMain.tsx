'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TableView } from '@/components/dashboard/table-view';
import { Status, ViewToggle } from '@/components/dashboard/view-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Tooltip from '@/components/ui/tooltip';
import { useSidebarState } from '@/contexts/SidebarContext';
import { useToast } from '@/hooks/use-toast';
import { useGetKnowledgeBase } from '@/lib/apiHooks/background/useGetKnowledgeBase';
import { supabase } from '@/lib/supabaseClient';
import MainLayout from './layout/MainLayout';
// Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ContentItem {
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
  keyword?: string;
  keyword_id?: number;
}

const ITEMS_PER_PAGE = 20;

const Dashboard02 = () => {
  const [view, setView] = useState<'cards'>('cards');
  const [status, setStatus] = useState<Status>(Status.All);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();
  const { isCollapsed } = useSidebarState();
  const router = useRouter();
  const pathname = usePathname();
  const { projectId } = useParams();

  const { isSuccess: isKnowledgeBaseSuccess, data: details } = useGetKnowledgeBase(
    projectId.toString()
  );

  const isBackgroundPresent = useMemo(() => {
    if (isKnowledgeBaseSuccess && details?.background?.basic) {
      return Object.values(details?.background?.basic || {}).every((value) => !Boolean(value));
    }
    return true;
  }, [details, isKnowledgeBaseSuccess]);

  const getContent = useCallback(
    async (supabase: SupabaseClient, projectId: string, page: number): Promise<ContentItem[]> => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('Content')
        .select(
          `
          *,
          keywords:keyword_id (
            keyword
          )
        `
        )
        .eq('project_id', projectId)
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching content: ${error.message}`);
      }

      const transformedData = data.map((item: any) => ({
        ...item,
        keyword: item.keywords?.keyword || null,
      }));

      return transformedData as ContentItem[];
    },
    []
  );

  const loadMoreItems = useCallback(async () => {
    if (!supabase || !projectId || isLoading) return;

    setIsLoading(true);
    try {
      const newItems = await getContent(supabase, projectId.toString(), page + 1);
      if (newItems.length < ITEMS_PER_PAGE) {
        setHasNextPage(false);
      }
      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      setError('Failed to fetch more content');
      console.error('Error fetching more content:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, page, isLoading, getContent]);

  const fetchContent = async () => {
    if (!projectId || !supabase) return [];
    const contentData = await getContent(supabase, projectId.toString(), 1);
    return contentData;
  };

  // Replace useEffect with useQuery
  const {
    data: contentData,
    error: fetchError,
    isLoading: fetchLoading,
  } = useQuery({
    queryKey: ['content', projectId],
    queryFn: fetchContent,
    enabled: !!projectId && !!supabase, // Only run if projectId and supabase are available
  });

  useEffect(() => {
    if (contentData) {
      setItems(contentData);
      setError(null);
      setPage(1);
      setHasNextPage(contentData.length === ITEMS_PER_PAGE);
    }
    if (fetchError) {
      setError('Failed to fetch content');
      console.error('Error fetching content:', fetchError);
    }
    setIsLoading(fetchLoading);
  }, [contentData, fetchError, fetchLoading]);

  const filteredItems =
    status === Status.All
      ? items
      : items.filter((item) => item.status.toLowerCase() === status.toLowerCase());

  const handleDeleteContent = useCallback(
    async (id: number) => {
      if (!supabase || !projectId) return;

      try {
        const { error } = await supabase.from('Content').delete().eq('id', id);

        if (error) {
          toast({
            title: 'Error',
            description: 'Failed to delete content',
            variant: 'destructive',
          });
          throw error;
        }

        // Update the local state to remove the deleted item
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));

        toast({
          title: 'Success',
          description: 'Content deleted successfully',
        });
      } catch (err) {
        console.error('Error deleting content:', err);
      }
    },
    [projectId, toast]
  );

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">An error occurred</h3>
            <p className="text-sm text-gray-500">{error}</p>
            <Button
              className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (pathname.includes('/content')) {
      return (
        <>
          <div className="">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight">Content</h1>
              <p className="mt-1 text-muted-foreground">
                Create, edit, and publish your content directly from Pulser.
              </p>
            </div>
          </div>
          <Separator className="" />
          <div className="mt-2">
            <ViewToggle
              view={view}
              // setView={setView}
              status={status}
              setStatus={handleSetStatus}
              onNewContent={() => router.push(`/projects/${projectId}/content/settings`)}
              basicBackground={isBackgroundPresent}
            />
          </div>
          {items.length === 0 ? (
            <div className="mt-4 flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 shadow-sm">
              <div className="flex flex-col items-center gap-1 p-8 text-center">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  No content available
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by creating your first piece of content
                </p>
                {isBackgroundPresent ? (
                  <Tooltip
                    content="Complete the background details first before proceeding"
                    side="top"
                  >
                    <span>
                      <Button
                        variant="default"
                        size="sm"
                        className="mt-4 bg-indigo-600 text-sm text-white hover:bg-indigo-700"
                        onClick={() => router.push(`/projects/${projectId}/content/settings`)}
                        disabled={isBackgroundPresent}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Content
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-4 bg-indigo-600 text-sm text-white hover:bg-indigo-700"
                    onClick={() => router.push(`/projects/${projectId}/content/settings`)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Content
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <TableView
              items={filteredItems}
              loading={isLoading}
              hasNextPage={hasNextPage}
              onLoadMore={loadMoreItems}
              onDelete={handleDeleteContent}
            />
            // <CardView
            //   items={filteredItems}
            //   loading={isLoading}
            //   hasNextPage={hasNextPage}
            //   onLoadMore={loadMoreItems}
            //   onDelete={handleDeleteContent}
            // />
          )}
        </>
      );
    } else {
      const title = pathname ? pathname.split('/')?.pop() : '';
      return (
        <>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold capitalize md:text-2xl">{title}</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                No {title} data available
              </h3>
              <p className="text-sm text-gray-500">
                You can start by adding some {title} information.
              </p>
              <Button className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700">
                Add {title}
              </Button>
            </div>
          </div>
        </>
      );
    }
  };

  const handleSetStatus = (newStatus: string) => {
    setStatus(newStatus as Status);
  };

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]'
      }`}
    >
      <Sidebar projectId={projectId.toString()} />
      <MainLayout>{renderContent()}</MainLayout>
    </div>
  );
};

export default Dashboard02;
