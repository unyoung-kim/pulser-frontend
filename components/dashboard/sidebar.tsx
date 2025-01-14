'use client';

import { useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  BrainCircuit,
  ChevronsUpDown,
  Folder,
  GalleryVerticalEnd,
  Mail,
  Settings,
  WholeWord,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Tooltip from '@/components/ui/tooltip';
import { Project, useProjects } from '@/contexts/ProjectContext';
import { useSidebarState } from '@/contexts/SidebarContext';
import { useGetKnowledgeBase } from '@/lib/apiHooks/useGetKnowledgeBase';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { NewContentButton } from './new-content-button';
import ProgressRing from './ProgressRing';

interface SidebarProps {
  projectId: string;
  children?: React.ReactNode;
  defaultCollapsed?: boolean;
}

interface Usage {
  credits_charged: number;
  additional_credits_charged: number;
  credits_used: number;
  plan: string;
  term: 'MONTHLY' | 'YEARLY';
}

export function Sidebar({ projectId, children, defaultCollapsed = false }: SidebarProps) {
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
    { name: 'Knowledge Base', href: '/background', icon: BrainCircuit },
    { name: 'Content', href: '/content', icon: WholeWord },
  ];

  const bottomLinks = [
    // { name: "Integration", href: "/integration", icon: Plug },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const ContactLink = () => {
    const Icon = Mail;
    const linkContent = (
      <div className="flex cursor-default items-center rounded-md px-2 py-2.5 font-medium text-gray-600 hover:bg-gray-50">
        <Icon className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
        {!isCollapsed && <span>Contact</span>}
      </div>
    );

    return isCollapsed ? (
      <Tooltip
        content={
          <>
            Need help? Email us at <strong>team@pulserseo.com</strong>
          </>
        }
        side="right"
      >
        {linkContent}
      </Tooltip>
    ) : (
      <Tooltip
        content={
          <>
            Need help? Email us at <strong>team@pulserseo.com</strong>
          </>
        }
        side="right"
      >
        {linkContent}
      </Tooltip>
    );
  };

  const handleProjectSelect = useCallback(
    (project: Project) => {
      router.push(`/content?projectId=${project.id}`);
    },
    [router]
  );

  // Query to fetch basic background data
  const { isSuccess: isKnowledgeBaseSuccess, data: details } = useGetKnowledgeBase(projectId);
  const isBackgroundPresent = useMemo(() => {
    if (!isKnowledgeBaseSuccess) return false;
    console.log(details);
    return Object.values(details?.background?.basic).every((value) => !Boolean(value));
  }, [details, isKnowledgeBaseSuccess]); //Returns true if all values are falsy

  const { data: usage, isLoading: isLoadingUsage } = useQuery<Usage>({
    queryKey: ['usage', orgId],
    queryFn: async () => {
      if (!orgId) throw new Error('No organization ID found');

      // First, get the organization and its current_usage_id
      const { data: orgData, error: orgError } = await supabase
        .from('Organization')
        .select('current_usage_id')
        .eq('org_id', orgId)
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        throw orgError;
      }

      // Then fetch the usage data using the current_usage_id
      const { data, error } = await supabase
        .from('Usage')
        .select('plan, credits_charged, additional_credits_charged, credits_used, term')
        .eq('id', orgData.current_usage_id)
        .single();

      if (error) {
        console.error('Error fetching usage:', error);
        throw error;
      }

      return {
        credits_charged: data.credits_charged || 0,
        additional_credits_charged: data.additional_credits_charged || 0,
        credits_used: data.credits_used || 0,
        plan: data.plan ?? 'FREE_CREDIT',
        term: data.term ?? 'MONTHLY',
      };
    },
    enabled: !!orgId,
  });

  // Memoize credits calculations
  const totalCredits = useMemo(
    () => (usage ? usage.credits_charged + usage.additional_credits_charged : 0),
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
    (document.querySelector('.cl-userButtonTrigger') as HTMLElement)?.click();
  }, []);

  // Memoize if credits are available
  const hasCreditsAvailable = useMemo(
    () => totalCredits > usedCredits,
    [totalCredits, usedCredits]
  );

  return (
    <div
      className={`sticky top-0 h-screen border-r bg-white transition-all duration-300 ${
        isCollapsed ? 'w-[60px]' : 'w-[220px] lg:w-[270px]'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {children}
          <div className="px-3 py-4">
            {isCollapsed ? (
              <Activity className="mx-auto mb-4 h-8 w-8 text-indigo-600" />
            ) : (
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={32}
                quality={100}
                className="mx-auto mb-4 h-auto w-auto"
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isCollapsed ? 'ghost' : 'outline'}
                  className={`h-12 w-full justify-between pl-2.5 text-sm ${
                    isCollapsed ? 'px-0' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Folder className="size-5" />
                    </div>
                    {!isCollapsed && (
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-[550]">
                          {selectedProject ? selectedProject.name : 'Select a project'}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && <ChevronsUpDown className="ml-auto h-4 w-4" />}
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
                        project.id.toString() === projectId ? 'bg-indigo-600 text-white' : 'border'
                      }`}
                    >
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    {project.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onSelect={() => router.push('/')}
                  className="mt-1 gap-2 border-t p-2"
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
                ) : !isBackgroundPresent ? (
                  <Tooltip content="You can proceed" side="right">
                    <div>
                      <NewContentButton disabled={false} />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip
                    content="Complete the background details first before proceeding"
                    side="right"
                  >
                    <div>
                      <NewContentButton disabled={true} />
                    </div>
                  </Tooltip>
                )}
              </div>
            )}
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const linkContent = (
                <Link
                  key={link.name}
                  href={`${link.href}${projectId ? `?projectId=${projectId}` : ''}`}
                  className={`mb-1 flex items-center rounded-md px-2 py-2.5 ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } font-medium`}
                >
                  <Icon className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
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
        {/* Remaining Credit */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 p-3">
            {isCollapsed ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="cursor-default">
                    <ProgressRing
                      used={usedCredits}
                      total={totalCredits}
                      className="text-blue-500"
                      size={isCollapsed ? 34 : 48}
                      labelClassName={isCollapsed ? 'text-xs' : 'text-sm'}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  side="right"
                  className="w-64 rounded-lg bg-white p-4 shadow-lg"
                  sideOffset={8} // Adjust spacing between trigger and content
                >
                  <div className={cn('flex flex-1 flex-col')}>
                    <h6 className="text-md font-semibold">Remaining Credit</h6>
                    <p className="text-xs text-gray-400">
                      You’ve used {usedCredits} of your {totalCredits} credits.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              <ProgressRing
                used={usedCredits}
                total={totalCredits}
                className="text-blue-500"
                size={isCollapsed ? 34 : 48}
                labelClassName={isCollapsed ? 'text-xs' : 'text-sm'}
              />
            )}
            <div className={cn('flex flex-1 flex-col', isCollapsed && 'hidden')}>
              <h6 className="text-md font-semibold">Remaining Credit</h6>
              <p className="text-xs text-gray-400">
                You’ve used {usedCredits} of your {totalCredits} credits.
              </p>
            </div>
          </div>
          <nav className="grid items-start px-3 text-sm font-medium">
            {bottomLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={`${link.href}${selectedProject ? `?projectId=${selectedProject.id}` : ''}`}
                  className={`flex items-center rounded-md px-2 py-2.5 ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } font-medium`}
                >
                  <Icon className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
            <ContactLink />
          </nav>
          <div className="mt-4 px-3 pb-4">
            <div className="flex w-full items-center">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
              {!isCollapsed && (
                <div onClick={handleUserButtonClick} className="flex-1 cursor-pointer">
                  <Button variant="ghost" className="h-12 w-full justify-between pl-2 text-sm">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.fullName}</span>
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
