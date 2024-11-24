"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import MainLayout from "@/components/layout/MainLayout";
import SettingsMain from "@/components/settings/SettingsMain";
import { Button } from "@/components/ui/button";
import { useSidebarState } from "@/contexts/SidebarContext";
import { usePathname, useSearchParams } from "next/navigation";

export default function PlansPage() {
  const { isCollapsed } = useSidebarState();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") || "";

  if (!projectId) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-1 text-center p-4">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Error: Project is not selected
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Please make sure you&apos;ve selected a project.
          </p>
          <Button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => (window.location.href = "/")}
          >
            Go to Projects
          </Button>
        </div>
      </div>
    );
  }

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
        <SettingsMain />
      </MainLayout>
    </div>
  );
}
