"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentEditor } from "@/components/content/ContentEditor";
import { ContentSettings } from "@/components/content/ContentSettings";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export default function NewContentPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") || "";
  const contentId = searchParams?.get("contentId");

  const { data: content } = useQuery({
    queryKey: ["content", contentId],
    queryFn: async () => {
      if (!contentId) return null;
      const { data, error } = await supabase
        .from("Content")
        .select("*")
        .eq("id", contentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!contentId,
  });

  const defaultTab = content?.generated_at ? "content" : "settings";

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="content" disabled={!content?.generated_at}>
            Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <ContentSettings projectId={projectId} contentId={contentId} />
        </TabsContent>

        <TabsContent value="content">
          {content && (
            <ContentEditor
              initialContent={content.content || ""}
              contentId={contentId || ""}
              projectId={projectId}
              title={content.title || ""}
              status={content.status || "drafted"}
              mainKeyword={content.keyword}
              keywords={content.keywords || []}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 