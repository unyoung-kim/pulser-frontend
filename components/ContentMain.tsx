"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { TableView } from "@/components/dashboard/table-view";
import { Status, ViewToggle } from "@/components/dashboard/view-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebarState } from "@/contexts/SidebarContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import MainLayout from "./layout/MainLayout";

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
  const [view, setView] = useState<"cards">("cards");
  const [status, setStatus] = useState<Status>(Status.All);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { isCollapsed } = useSidebarState();
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") || "";

  // useEffect(() => {
  //   const supabaseClient = createClient(supabaseUrl, supabaseKey);
  //   setSupabase(supabaseClient);
  // }, []);

  const getContent = useCallback(
    async (
      supabase: SupabaseClient,
      projectId: string,
      page: number
    ): Promise<ContentItem[]> => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("Content")
        .select(
          `
          *,
          keywords:keyword_id (
            keyword
          )
        `
        )
        .eq("project_id", projectId)
        .range(start, end)
        .order("created_at", { ascending: false });

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
      const newItems = await getContent(supabase, projectId, page + 1);
      if (newItems.length < ITEMS_PER_PAGE) {
        setHasNextPage(false);
      }
      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      setError("Failed to fetch more content");
      console.error("Error fetching more content:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, page, isLoading, getContent]);

  const fetchContent = async () => {
    if (!projectId || !supabase) return [];
    const contentData = await getContent(supabase, projectId, 1);
    return contentData;
  };

  // Replace useEffect with useQuery
  const {
    data: contentData,
    error: fetchError,
    isLoading: fetchLoading,
  } = useQuery({
    queryKey: ["content", projectId],
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
      setError("Failed to fetch content");
      console.error("Error fetching content:", fetchError);
    }
    setIsLoading(fetchLoading);
  }, [contentData, fetchError, fetchLoading]);

  const filteredItems =
    status === Status.All
      ? items
      : items.filter(
          (item) => item.status.toLowerCase() === status.toLowerCase()
        );

  const handleDeleteContent = useCallback(
    async (id: number) => {
      if (!supabase || !projectId) return;

      try {
        const { error } = await supabase.from("Content").delete().eq("id", id);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to delete content",
            variant: "destructive",
          });
          throw error;
        }

        // Update the local state to remove the deleted item
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));

        toast({
          title: "Success",
          description: "Content deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting content:", err);
      }
    },
    [supabase, projectId, toast]
  );

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              An error occurred
            </h3>
            <p className="text-sm text-gray-500">{error}</p>
            <Button
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (pathname === "/content") {
      return (
        <>
          <div className="">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight">Content</h1>
              <p className="text-muted-foreground mt-1">
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
              onNewContent={() =>
                router.push(`/content/settings?projectId=${projectId}`)
              }
            />
          </div>
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 shadow-sm mt-4">
              <div className="flex flex-col items-center gap-1 text-center p-8">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  No content available
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Get started by creating your first piece of content
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                  onClick={() =>
                    router.push(`/content/settings?projectId=${projectId}`)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Content
                </Button>
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
      const title = pathname
        ? pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)
        : "";
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
      );
    }
  };

  const handleSetStatus = (newStatus: string) => {
    setStatus(newStatus as Status);
  };

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed
          ? "grid-cols-[60px_1fr]"
          : "grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]"
      }`}
    >
      <Sidebar projectId={projectId} />
      <MainLayout>{renderContent()}</MainLayout>
    </div>
  );
};

export default Dashboard02;
