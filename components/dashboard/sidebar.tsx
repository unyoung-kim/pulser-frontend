import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Package2, Users, LineChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton } from "@clerk/nextjs"

export function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('projectId')

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Content", href: "/content" },
    { name: "Background", href: "/background" },
    { name: "Integration", href: "/integration" },
  ]

  return (
    <div className="hidden border-r bg-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-10 items-center border-b px-2 lg:h-[55px] lg:px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-indigo-600" />
            <span className="text-indigo-600 text-sm">Pulser</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <UserButton />
            {/* <Button variant="outline" size="icon" className="h-6 w-6">
              <Bell className="h-3 w-3" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-3">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={`${link.href}${projectId ? `?projectId=${projectId}` : ''}`}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-1 pt-0 md:p-4">
              <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
              <CardDescription className="text-xs">
                Unlock all features and get unlimited access to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-1 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="text-xs w-full bg-indigo-600 hover:bg-indigo-700">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
