'use client'

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { CardView } from "@/components/dashboard/card-view"
import { TableView } from "@/components/dashboard/table-view"
import { ViewToggle } from "@/components/dashboard/view-toggle"
import { Button } from "@/components/ui/button"

// Mock data for cards and table
export const items = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: `Social Media Trends 202${i + 1}`,
  description: `Description for Item ${i + 1}`,
  image: `https://picsum.photos/seed/${i + 1}/200/200`,
  date: `April ${i + 1}, 2024`,
  type: `Guide`,
  status: i % 2 === 0 ? 'Scheduled' : 'Draft',
  tags: ['SEO', 'Content Marketing'],
}))

export function Dashboard() {
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const pathname = usePathname()

  const renderContent = () => {
    if (pathname === '/content') {
      return (
        <>
          <ViewToggle view={view} setView={setView} />
          {view === 'cards' ? <CardView items={items} /> : <TableView items={items} />}
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
