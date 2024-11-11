"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import KeywordMain from "@/components/keyword/KeywordMain";
import MainLayout from "@/components/layout/MainLayout";
import { useSidebarState } from "@/contexts/SidebarContext";
import { useSearchParams } from "next/navigation";

export default function BackgroundPage() {
  const { isCollapsed } = useSidebarState();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") || "";

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed
          ? "grid-cols-[60px_1fr]"
          : "grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]"
      }`}
    >
      <Sidebar projectId={projectId} />
      <MainLayout>
        <KeywordMain />
      </MainLayout>
    </div>
  );
}
