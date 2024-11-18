"use client";

import BackgroundForm2 from "@/components/background/Form";
import { Sidebar } from "@/components/dashboard/sidebar";
import MainLayout from "@/components/layout/MainLayout";
import { useSidebarState } from "@/contexts/SidebarContext";
import { useSearchParams } from "next/navigation";
import { useRestrictedAccess } from "@/hooks/useRestrictedAccess";
import { Loader } from "@/components/ui/loader";

export default function BackgroundPage() {
  const { isLoading, isRestricted } = useRestrictedAccess();
  const { isCollapsed } = useSidebarState();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") || "";

  if (isLoading) {
    return <Loader />;
  }

  if (isRestricted) {
    return null; // The hook will handle redirection
  }

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed
          ? "grid-cols-[60px_1fr]"
          : "grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]"
      }`}
    >
      <Sidebar projectId={projectId} defaultCollapsed={false} />
      <MainLayout>
        <BackgroundForm2 projectId={projectId} />
        {/* <BackgroundForm projectId={projectId} /> */}
      </MainLayout>
    </div>
  );
}
