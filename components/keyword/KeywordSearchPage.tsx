import { useSearchParams } from 'next/navigation';
import { useSidebarState } from '@/contexts/SidebarContext';
import KeywordSearchCard from './KeywordSearchCard';
import { Sidebar } from '../dashboard/sidebar';
import MainLayout from '../layout/MainLayout';

export default function KeywordSearchPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('projectId') || '';
  const { isCollapsed } = useSidebarState();

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]'
      }`}
    >
      <Sidebar projectId={projectId} />
      <MainLayout>
        <div className="container mx-auto flex h-full items-center justify-center px-4">
          {/* <div className="w-full space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Keyword Search</h1>
              <p className="text-muted-foreground">
                Search for keywords that are relevant to your business.
              </p>
            </div>

            <Separator /> */}

          <KeywordSearchCard />
          {/* </div> */}
        </div>
      </MainLayout>
    </div>
  );
}
