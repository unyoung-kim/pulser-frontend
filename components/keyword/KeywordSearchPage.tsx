import { useParams } from 'next/navigation';
import { useSidebarState } from '@/contexts/SidebarContext';
import KeywordSearchCard from './KeywordSearchCard';
import { Sidebar } from '../dashboard/sidebar';
import MainLayout from '../layout/MainLayout';

export default function KeywordSearchPage() {
  const { projectId } = useParams();
  const { isCollapsed } = useSidebarState();

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]'
      }`}
    >
      <Sidebar projectId={projectId.toString()} />
      <MainLayout>
        <div className="container mx-auto flex h-full items-center justify-center px-4">
          <KeywordSearchCard />
        </div>
      </MainLayout>
    </div>
  );
}
