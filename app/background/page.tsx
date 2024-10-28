'use client';

import { useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { Loader } from "@/components/ui/loader";
import { Sidebar } from "@/components/dashboard/sidebar";
import { BackgroundForm } from "@/components/BackgroundForm";

export default function BackgroundPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId') || ''; // Provide default empty string
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <Sidebar projectId={projectId} />
      <div className="flex flex-col">
        <main className="flex-grow bg-gray-50">
          {loading && <Loader />}
          <BackgroundForm />
        </main>
      </div>
    </div>
  );
}
