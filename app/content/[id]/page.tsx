'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ContentEditor } from '@/components/content/ContentEditor';
import { Sidebar } from "@/components/dashboard/sidebar";
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { Loader } from '@/components/ui/loader';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function ContentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const contentId = params.id;

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', contentId],
    queryFn: async () => {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('Content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!contentId,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]">
      <Sidebar projectId={projectId || ''} />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50">
          <ContentEditor 
            initialContent={content?.content || ''}
            contentId={contentId as string}
            projectId={projectId || ''}
            title={content?.title || ''}
            status={content?.status || 'drafted'}
            mainKeyword={content?.keyword}
          />
        </main>
      </div>
    </div>
  );
} 