"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Tooltip from "@/components/ui/tooltip";
import { Project, useProjects } from "@/contexts/ProjectContext";
import { useSidebarState } from "@/contexts/SidebarContext";
import { supabase } from "@/lib/supabaseClient";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BrainCircuit,
  ChevronsUpDown,
  Folder,
  GalleryVerticalEnd,
  Settings,
  WholeWord,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { NewContentButton } from "./new-content-button";

interface SidebarProps {
  projectId: string;
  children?: React.ReactNode;
  defaultCollapsed?: boolean;
}

interface Usage {
  credits_charged: number;
  additional_credits_charged: number;
  credits_used: number;
}

export function Sidebar({
  projectId,
  children,
  defaultCollapsed = false,
}: SidebarProps) {
  const { orgId } = useAuth();
  const { isCollapsed, toggleSidebar, setIsCollapsed } = useSidebarState();
  const pathname = usePathname();
  const router = useRouter();
  const { projects } = useProjects();
  const { user } = useUser();

  // Update the effect to run whenever defaultCollapsed changes
  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed, setIsCollapsed]);

  // Memoize the selected project
  const selectedProject = useMemo(
    () => projects.find((p) => p.id.toString() === projectId) || null,
    [projects, projectId]
  );

  const links = [
    { name: "Knowledge Base", href: "/background", icon: BrainCircuit },
    { name: "Content", href: "/content", icon: WholeWord },
  ];

  const bottomLinks = [
    // { name: "Integration", href: "/integration", icon: Plug },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleProjectSelect = useCallback(
    (project: Project) => {
      router.push(`/content?projectId=${project.id}`);
    },
    [router]
  );

  const { data: usage, isLoading: isLoadingUsage } = useQuery<Usage>({
    queryKey: ["usage", orgId],
    queryFn: async () => {
      if (!orgId) throw new Error("No organization ID found");

      // First try to get existing data
      const { data, error } = await supabase
        .from("Usage")
        .select("credits_charged, additional_credits_charged, credits_used")
        .eq("org_id", orgId)
        .is("end_date", null)
        .single();

      if (error) {
        // If no rows found, create a new row
        if (error.code === "PGRST116") {
          const { data: newData, error: insertError } = await supabase
            .from("Usage")
            .insert([
              {
                org_id: orgId,
                start_date: new Date().toISOString().split("T")[0],
                credits_used: 0,
                credits_charged: 0,
                additional_credits_charged: 0,
                end_date: null,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error("Error inserting usage data:", insertError);
            throw insertError;
          }

          return {
            credits_charged: newData?.credits_charged || 0,
            additional_credits_charged:
              newData?.additional_credits_charged || 0,
            credits_used: newData?.credits_used || 0,
          };
        }

        // For other errors, log and throw
        console.error("Supabase error:", error);
        throw error;
      }

      return {
        credits_charged: data.credits_charged || 0,
        additional_credits_charged: data.additional_credits_charged || 0,
        credits_used: data.credits_used || 0,
      };
    },
    enabled: !!orgId,
  });

  // Memoize credits calculations
  const totalCredits = useMemo(
    () =>
      usage ? usage.credits_charged + usage.additional_credits_charged : 0,
    [usage]
  );

  const usedCredits = useMemo(() => usage?.credits_used || 0, [usage]);

  // Memoize the width calculation for the progress bar
  const progressBarWidth = useMemo(
    () => `${totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0}%`,
    [totalCredits, usedCredits]
  );

  // Add useCallback for the UserButton click handler
  const handleUserButtonClick = useCallback(() => {
    (document.querySelector(".cl-userButtonTrigger") as HTMLElement)?.click();
  }, []);

  // Memoize if credits are available
  const hasCreditsAvailable = useMemo(
    () => totalCredits > usedCredits,
    [totalCredits, usedCredits]
  );

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
            {isCollapsed ? (
              <Activity className="h-8 w-8 mx-auto text-indigo-600 mb-4" />
            ) : (
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={32}
                className="mx-auto mb-4"
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isCollapsed ? "ghost" : "outline"}
                  className={`w-full justify-between h-12 text-sm pl-2.5 ${
                    isCollapsed ? "px-0" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Folder className="size-5" />
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
                      <GalleryVerticalEnd className="size-4" />
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
            {!isCollapsed && (
              <div className="mb-2">
                {!hasCreditsAvailable ? (
                  <Tooltip content="No credits remaining" side="right">
                    <div>
                      <NewContentButton disabled={true} />
                    </div>
                  </Tooltip>
                ) : (
                  <NewContentButton disabled={false} />
                )}
              </div>
            )}
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const linkContent = (
                <Link
                  key={link.name}
                  href={`${link.href}${
                    projectId ? `?projectId=${projectId}` : ""
                  }`}
                  className={`flex items-center rounded-md px-2 py-2.5 mb-1 ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } font-medium`}
                >
                  <Icon className={`${isCollapsed ? "" : "mr-3"} h-4 w-4`} />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );

              return isCollapsed ? (
                <Tooltip key={link.name} content={link.name} side="right">
                  {linkContent}
                </Tooltip>
              ) : (
                linkContent
              );
            })}
          </nav>
        </div>

        <div className="mt-auto ">
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
                  className={`flex items-center rounded-md px-2 py-2.5 mt-2 ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } font-medium`}
                >
                  <Icon className={`${isCollapsed ? "" : "mr-3"} h-4 w-4`} />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-3">
            <div className="px-2 py-1">
              <span className="text-xs font-medium">Credits Remaining</span>
            </div>
            <div className="px-3 py-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isLoadingUsage ? "-" : usedCredits}
                </span>
                <span className="text-xs text-muted-foreground">
                  of {isLoadingUsage ? "-" : totalCredits}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: progressBarWidth }}
                />
              </div>
            </div>
          </div>
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
                <div
                  onClick={handleUserButtonClick}
                  className="cursor-pointer flex-1"
                >
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* {!defaultCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full border bg-white p-0 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )} */}
    </div>
  );
}
