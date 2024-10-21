'use client'

import { useState, useEffect, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { CardView } from "@/components/dashboard/card-view"
import { TableView } from "@/components/dashboard/table-view"
import { ViewToggle } from "@/components/dashboard/view-toggle"
import { Button } from "@/components/ui/button"
import { trpc } from '../utils/trpc';
import { Loader } from '@/components/ui/loader'; // Implied import for Loader component

interface ContentItem {
  id: number
  title: string
  status: string
  updated_at: string
}

const Dashboard02 = () => {
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [status, setStatus] = useState<string>('All')
  const [items, setItems] = useState<ContentItem[]>([])
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  console.log("projectId", projectId)
  const queryInput = { projectId }; // Changed from useCallback to direct object
  const { data, isLoading, error } = trpc.content.useQuery(queryInput, {
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />; // Changed from loading text to Loader component
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("items", items)
  const filteredItems = status === 'All'
    ? items
    : items.filter(item => item.status === status)
  console.log("filteredItems", filteredItems)
  console.log("status", status)
  const renderContent = () => {
    if (pathname === '/content') {
      return (
        <>
          <ViewToggle view={view} setView={setView} status={status} setStatus={setStatus} />
          {view === 'cards' ? (
            <CardView 
              items={filteredItems} 
              loading={isLoading} 
              hasNextPage={false}
              onLoadMore={() => {}}
            />
          ) : (
            <TableView 
              items={filteredItems}
              loading={isLoading}
              hasNextPage={false}
              onLoadMore={() => {}}
            />
          )}
        </>
      )
    } else {
      const title = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)
      return (
        <>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                No {title.toLowerCase()} data available
              </h3>
              <p className="text-sm text-gray-500">
                You can start by adding some {title.toLowerCase()} information.
              </p>
              <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                Add {title}
              </Button>
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[170px_1fr] lg:grid-cols-[220px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header showSearch={pathname === '/content'} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-4 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard02;
