'use client';

import { useUser, useOrganization } from "@clerk/nextjs";
import { CreateOrganization } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import ProjectSection from './ProjectSection';
import { Loader } from "@/components/ui/loader";
import { useRouter } from 'next/navigation';

export default function AuthWrapper() {
  const { isSignedIn, user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isClient || !isLoaded) {
    return <Loader />;
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold mb-4">Create an Organization</h1>
        <CreateOrganization />
      </div>
    );
  }

  return <ProjectSection />;
}
