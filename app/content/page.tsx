'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";

const Dashboard = dynamic(() => import('@/components/dashboard-02'), { ssr: false });

export default function ContentPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

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
            onClick={() => window.location.href = '/'}
          >
            Go to Projects
          </Button>
        </div>
      </div>
    );
  }

  return <Dashboard/>;
}
