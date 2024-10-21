'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/dashboard-02'), { ssr: false });

export default function ContentPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return <div>Error: No project ID provided</div>;
  }

  return <Dashboard projectId={parseInt(projectId, 10)} />;
}
