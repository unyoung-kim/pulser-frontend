import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package2, Users, LineChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton } from "@clerk/nextjs"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/background", icon: Users, label: "Background" },
    { href: "/content", icon: LineChart, label: "Content" },
    { href: "/play", icon: Settings, label: "Play" },
    { href: "/integration", icon: Settings, label: "Integration" },
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
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
