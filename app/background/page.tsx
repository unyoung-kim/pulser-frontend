"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BackgroundForm2 from "@/components/background/Form";
import { Sidebar } from "@/components/dashboard/sidebar";
import MainLayout from "@/components/layout/MainLayout";
import { useSidebarState } from "@/contexts/SidebarContext";
import { useSearchParams } from "next/navigation";

export default function BackgroundPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { isCollapsed } = useSidebarState();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") || "";

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null; // or a loading spinner
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
      </MainLayout>
    </div>
  );
}
