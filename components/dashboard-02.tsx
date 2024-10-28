'use client'

import { useState, useEffect, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Sidebar } from "@/components/dashboard/sidebar"
import { CardView } from "@/components/dashboard/card-view"
import { TableView } from "@/components/dashboard/table-view"
import { ViewToggle } from "@/components/dashboard/view-toggle"
import { Button } from "@/components/ui/button"
// import { Loader } from '@/components/ui/loader'
import { useQuery } from '@tanstack/react-query';
import { Status } from "@/components/dashboard/view-toggle"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ContentItem {
  id: number
  title: string
  status: string
  updated_at: string
  created_at: string
  image_url: string
  description?: string
  date?: string
  type?: string
  tags?: string[]
  keyword?: string // Add this line
}

const ITEMS_PER_PAGE = 20;

const Dashboard02 = () => {
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [status, setStatus] = useState<Status>(Status.All)
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('projectId') || ''

  useEffect(() => {
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    setSupabase(supabaseClient);
  }, []);

  const getContent = useCallback(async (supabase: SupabaseClient, projectId: string, page: number): Promise<ContentItem[]> => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('Content')
      .select('*')
      .eq('project_id', projectId)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching content: ${error.message}`);
    }

    return data as ContentItem[];
  }, []);

  const loadMoreItems = useCallback(async () => {
    if (!supabase || !projectId || isLoading) return;

    setIsLoading(true);
    try {
      const newItems = await getContent(supabase, projectId, page + 1);
      if (newItems.length < ITEMS_PER_PAGE) {
        setHasNextPage(false);
      }
      setItems(prevItems => [...prevItems, ...newItems]);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      setError('Failed to fetch more content');
      console.error('Error fetching more content:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, projectId, page, isLoading, getContent]);

  const fetchContent = async () => {
    if (!projectId || !supabase) return [];
    const contentData = await getContent(supabase, projectId, 1);
    return contentData;
  };

  // Replace useEffect with useQuery
  const { data: contentData, error: fetchError, isLoading: fetchLoading } = useQuery(
    ['content', projectId],
    fetchContent,
    {
      enabled: !!projectId && !!supabase, // Only run if projectId and supabase are available
    }
  );

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

  const filteredItems = status === Status.All
    ? items
    : items.filter(item => item.status.toLowerCase() === status.toLowerCase())

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              An error occurred
            </h3>
            <p className="text-sm text-gray-500">
              {error}
            </p>
            <Button 
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      )
    }

    if (pathname === '/content') {
      return (
        <>
          <div className="mt-6">
            <ViewToggle 
              view={view} 
              setView={setView} 
              status={status} 
              setStatus={handleSetStatus} 
            />
          </div>
          {/* {isLoading && <Loader />} */}
          {view === 'cards' ? (
            <CardView 
              items={filteredItems} 
              loading={isLoading} 
              hasNextPage={hasNextPage}
              onLoadMore={loadMoreItems}
            />
          ) : (
            <TableView 
              items={filteredItems}
              loading={isLoading}
              hasNextPage={hasNextPage}
              onLoadMore={loadMoreItems}
            />
          )}
        </>
      )
    } else {
      const title = pathname ? pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2) : ''
      return (
        <>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                No {title.toLowerCase()} data available
              </h3>
              <p className="text-sm text-gray-500">
                You can start by adding some {title.toLowerCase()} information.
              </p>
              <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                Add {title}
              </Button>
            </div>
          </div>
        </>
      )
    }
  }

  const handleSetStatus = (newStatus: string) => {
    setStatus(newStatus as Status)
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]">
      <Sidebar projectId={projectId} />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-4 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard02;
