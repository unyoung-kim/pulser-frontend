'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { CalendarDays, Users2, Rocket, LifeBuoy } from 'lucide-react';
import BackgroundForm2 from '@/components/background/Form';
import { Sidebar } from '@/components/dashboard/sidebar';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebarState } from '@/contexts/SidebarContext';

export default function TutorialPage() {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { isCollapsed } = useSidebarState();
  const { projectId } = useParams();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null; // or a loading spinner
  }

  return (
    <div
      className={`grid min-h-screen w-full transition-[grid-template-columns] duration-300 ${
        isCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-[220px_1fr] lg:grid-cols-[270px_1fr]'
      }`}
    >
      <Sidebar projectId={projectId.toString()} defaultCollapsed={false} />
      <MainLayout>
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Video Guide</h1>
              <p className="text-muted-foreground">Learn how to use Pulser in 5 minutes.</p>
            </div>

            <Separator className="" />

            <div className="mt-2">
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h2 className="mb-8 text-2xl font-semibold text-slate-900">
                  Watch onboarding video
                </h2>

                <div className="grid items-start gap-8 lg:grid-cols-2">
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    {isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#6C5CE7]"></div>
                      </div>
                    )}
                    <div
                      style={{
                        position: 'relative',
                        paddingBottom: '52.916666666666664%',
                        height: '0',
                      }}
                    >
                      <iframe
                        src="https://www.loom.com/embed/2ca8fa0b1f9749cda2c329ae04b764e6?sid=eab3d40d-b378-49ac-b6fa-b582e618d69a"
                        frameBorder="0"
                        allow="fullscreen"
                        allowFullScreen
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                        onLoad={() => setIsVideoLoading(false)}
                      ></iframe>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <p className="text-lg text-slate-700">
                      We&#39;re excited to help you grow your organic traffic. Watch a quick
                      onboarding video to get started.
                    </p>

                    {/* <div className="space-y-4">
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 text-[#6C5CE7] hover:underline"
                      >
                        Developer quickstart guide
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4.66667 11.3333L11.3333 4.66667M11.3333 4.66667H4.66667M11.3333 4.66667V11.3333"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 text-[#6C5CE7] hover:underline"
                      >
                        ROI calculator
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4.66667 11.3333L11.3333 4.66667M11.3333 4.66667H4.66667M11.3333 4.66667V11.3333"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div> */}

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Button
                        className="bg-[#6C5CE7] hover:bg-[#6C5CE7]/90"
                        size="lg"
                        onClick={() => (window.location.href = 'mailto:team@pulserseo.com')}
                      >
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Need help to get started?
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push(`/projects/${projectId}/background`)}
                      >
                        <Rocket className="mr-2 h-4 w-4" />
                        Get started
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
