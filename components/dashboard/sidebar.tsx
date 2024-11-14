"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project, useProjects } from "@/contexts/ProjectContext";
import { useSidebarState } from "@/contexts/SidebarContext";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Activity,
  ActivitySquare,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Plug,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

interface SidebarProps {
  projectId: string;
  children?: React.ReactNode;
}

export function Sidebar({ projectId, children }: SidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const pathname = usePathname();
  const router = useRouter();
  const { projects } = useProjects();
  const { user } = useUser();

  // Memoize the selected project
  const selectedProject = useMemo(
    () => projects.find((p) => p.id.toString() === projectId) || null,
    [projects, projectId]
  );

  const links = [
    { name: "Background", href: "/background", icon: ActivitySquare },
    { name: "Content", href: "/content", icon: BookOpen },
  ];

  const bottomLinks = [
    { name: "Integration", href: "/integration", icon: Plug },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleProjectSelect = useCallback(
    (project: Project) => {
      router.push(`/content?projectId=${project.id}`);
    },
    [router]
  );

  const handleCollapse = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <div
      className={`sticky top-0 h-screen border-r bg-white transition-all duration-300 ${
        isCollapsed ? "w-[60px]" : "w-[220px] lg:w-[270px]"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {children}
          <div className="px-3 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-between h-12 text-sm pl-2.5 ${
                    isCollapsed ? "px-0" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Activity className="size-5" />
                    </div>
                    {!isCollapsed && (
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-[550]">
                          {selectedProject
                            ? selectedProject.name
                            : "Select a project"}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <ChevronsUpDown className="ml-auto h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 rounded-lg p-1">
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onSelect={() => handleProjectSelect(project)}
                    className="gap-2 p-2"
                  >
                    <div
                      className={`flex size-6 items-center justify-center rounded-sm ${
                        project.id.toString() === projectId
                          ? "bg-indigo-600 text-white"
                          : "border"
                      }`}
                    >
                      <GalleryVerticalEnd className="size-4 " />
                    </div>
                    {project.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onSelect={() => router.push("/")}
                  className="gap-2 p-2 border-t mt-1"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  All Projects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav className="grid items-start px-3 text-sm font-medium">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={`${link.href}${
                    projectId ? `?projectId=${projectId}` : ""
                  }`}
                  className={`flex items-center rounded-md px-2 py-2.5 ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`${isCollapsed ? "" : "mr-3"} h-4 w-4`} />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t">
          <nav className="grid items-start px-3 text-sm font-medium">
            {bottomLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={`${link.href}${
                    selectedProject ? `?projectId=${selectedProject.id}` : ""
                  }`}
                  className={`flex items-center rounded-md px-2 py-2.5 ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`${isCollapsed ? "" : "mr-3"} h-4 w-4`} />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 px-3 pb-4">
            <div className="flex items-center w-full">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  className="w-full justify-between h-12 text-sm pl-2"
                >
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.fullName}
                    </span>
                    <span className="truncate text-xs">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCollapse}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full border bg-white p-0 hover:bg-gray-100"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
