'use client';

import { BackgroundForm } from "@/components/BackgroundForm";
import { useSidebarState } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useSearchParams } from "next/navigation";

export default function BackgroundPage() {
  const { isCollapsed } = useSidebarState();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('projectId') || '';

  return (
    <div className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
      isCollapsed 
        ? 'grid-cols-[60px_1fr]' 
        : 'grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]'
    }`}>
      <Sidebar projectId={projectId} />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-4 bg-gray-50">
          <BackgroundForm projectId={projectId} />
        </main>
      </div>
    </div>
  );
}
