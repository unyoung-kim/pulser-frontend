import Image from "next/image"
import {
  MoreHorizontal,
  PlusCircle,
  ListFilter,
  File,
  Search,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export default function YourContentPage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-background sm:gap-4 sm:py-4 sm:pl-14 sm:pr-14">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center border-b border-border mb-4">
          <TabsList className="bg-background">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
            <TabsTrigger value="published" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Published</TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Scheduled</TabsTrigger>
            <TabsTrigger value="draft" className="hidden sm:flex data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Draft
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Published</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Scheduled</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Content
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card className="border-primary/20">
            <CardHeader className="border-b border-primary/10 pb-4">
              <CardTitle className="text-primary">Content</CardTitle>
              <CardDescription className="mt-2">
                Manage contents and view their details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  {
                    name: "Laser Lemonade Machine",
                    status: "Draft",
                    price: "$499.99",
                    sales: "25",
                    createdAt: "2023-07-12 10:42 AM"
                  },
                  {
                    name: "Hypernova Headphones",
                    status: "Active",
                    price: "$129.99",
                    sales: "100",
                    createdAt: "2023-10-18 03:21 PM"
                  },
                  {
                    name: "AeroGlow Desk Lamp",
                    status: "Active",
                    price: "$39.99",
                    sales: "50",
                    createdAt: "2023-11-29 08:15 AM"
                  },
                  {
                    name: "TechTonic Energy Drink",
                    status: "Draft",
                    price: "$2.99",
                    sales: "0",
                    createdAt: "2023-12-25 11:59 PM"
                  },
                  {
                    name: "Gamer Gear Pro Controller",
                    status: "Active",
                    price: "$59.99",
                    sales: "75",
                    createdAt: "2024-01-01 12:00 AM"
                  },
                  {
                    name: "Luminous VR Headset",
                    status: "Active",
                    price: "$199.99",
                    sales: "30",
                    createdAt: "2024-02-14 02:14 PM"
                  },
                  {
                    name: "TechTonic Energy Drink",
                    status: "Draft",
                    price: "$2.99",
                    sales: "0",
                    createdAt: "2023-12-25 11:59 PM"
                  },
                  {
                    name: "Gamer Gear Pro Controller",
                    status: "Active",
                    price: "$59.99",
                    sales: "75",
                    createdAt: "2024-01-01 12:00 AM"
                  },
                  {
                    name: "Luminous VR Headset",
                    status: "Active",
                    price: "$199.99",
                    sales: "30",
                    createdAt: "2024-02-14 02:14 PM"
                  }
                ].map((product, index) => (
                  <div key={index} className="border rounded-lg p-3 flex flex-col bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex flex-col h-full">
                      <div className="flex-shrink-0">
                        <Image
                          alt={`${product.name} image`}
                          className="aspect-square rounded-md object-cover"
                          height="48"
                          src="/placeholder.svg"
                          width="48"
                        />
                      </div>
                      <div className="flex-grow flex flex-col mt-2">
                        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                        <Badge variant={product.status === "Draft" ? "secondary" : "outline"} className="mt-1 self-start text-xs">
                          {product.status}
                        </Badge>
                        <p className="mt-1 text-xs">Price: {product.price}</p>
                        <p className="text-xs">Total Sales: {product.sales}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Created: {product.createdAt}</p>
                      </div>
                      <div className="flex-shrink-0 self-end mt-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-9</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}