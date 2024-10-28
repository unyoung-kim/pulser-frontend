'use client';

import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import ProjectSection from "@/components/ProjectSection";
import { useSearchParams } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('projectId') || '';

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} />
      <div className="flex-1 flex">
        <Sidebar projectId={projectId}>
          <ProjectSection />
        </Sidebar>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
