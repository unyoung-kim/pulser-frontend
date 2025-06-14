'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ContentEditor } from '@/components/content/ContentEditor';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Loader } from '@/components/ui/loader';
import { useSidebarState } from '@/contexts/SidebarContext';
import { supabase } from '@/lib/supabaseClient';
import '../editor.css';

export default function ContentPage() {
  const { id: contentId, projectId } = useParams();
  const { isCollapsed } = useSidebarState();
  const { data: content, isLoading: isContentLoading } = useQuery({
    queryKey: ['content', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Content')
        .select(
          `
          *,
          Keyword!keyword_id (keyword)
        `
        )
        .eq('id', contentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!contentId,
    refetchOnWindowFocus: false,
  });

  // const { data: contentBody, isLoading: isBodyLoading } = useQuery({
  //   queryKey: ["contentBody", contentId],
  //   queryFn: async () => {
  //     const { data, error } = await supabase
  //       .from("ContentBody")
  //       .select("body")
  //       .eq("content_id", contentId)
  //       .order("updated_at", { ascending: false })
  //       .limit(1)
  //       .single();

  //     if (error && error.code === "PGRST116") return null; // No rows found
  //     if (error) throw error;
  //     return data;
  //   },
  //   enabled: !!contentId,
  // });

  if (isContentLoading) {
    return <Loader />;
  }

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]'
      }`}
    >
      <Sidebar projectId={projectId.toString() || ''} defaultCollapsed={true} />
      {/* {!contentBody ? (
        <div className="flex flex-col flex-1 items-center">
          <ContentSettings />
        </div>
      ) : ( */}
      <div className="flex flex-col">
        <main className="mr-80 flex flex-1 flex-col gap-4 bg-gray-50 p-4 lg:gap-6 lg:p-10">
          <ContentEditor
            initialContent=""
            contentId={contentId as string}
            projectId={projectId.toString() || ''}
            title={content?.title || ''}
            status={content?.status || 'drafted'}
            keyword={content?.Keyword?.keyword}
            type={content?.type || 'NORMAL'}
          />
        </main>
      </div>
      {/* )} */}
    </div>
  );
}
