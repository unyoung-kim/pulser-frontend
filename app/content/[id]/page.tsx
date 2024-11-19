"use client";

import { ContentEditor } from "@/components/content/ContentEditor";
import ContentSettings from "@/components/content/ContentSettings";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { useSidebarState } from "@/contexts/SidebarContext";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function ContentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const contentId = params.id;
  const { isCollapsed } = useSidebarState();
  const [currentStep, setCurrentStep] = useState<"settings" | "editor">(
    "settings"
  );

  const { data: content, isLoading } = useQuery({
    queryKey: ["content", contentId],
    queryFn: async () => {
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed
          ? "grid-cols-[60px_1fr]"
          : "grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]"
      }`}
    >
      <Sidebar projectId={projectId || ""} defaultCollapsed={true} />
      <div className="flex flex-col">
        <nav className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-6">
            {["Content Settings", "Edit Content"].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <Badge
                  variant={index === 0 ? "default" : "secondary"}
                  className="rounded-full"
                >
                  {index + 1}
                </Badge>
                <span
                  className={
                    index === 0 ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </nav>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-10 bg-gray-50 mr-80">
          {currentStep === "settings" ? (
            <ContentSettings
              onNext={() => setCurrentStep("editor")}
              initialTitle={content?.title || ""}
              initialKeywords={content?.keywords || []}
            />
          ) : (
            <ContentEditor
              initialContent={content?.content || ""}
              contentId={contentId as string}
              projectId={projectId || ""}
              title={content?.title || ""}
              status={content?.status || "drafted"}
              mainKeyword={content?.keyword}
              keywords={content?.keywords || []}
            />
          )}
        </main>
      </div>
    </div>
  );
}
