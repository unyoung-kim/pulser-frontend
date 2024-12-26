'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateOrganization, useOrganization, useUser } from '@clerk/nextjs';
import { Loader } from '@/components/ui/loader';
import ProjectSection from './ProjectSection';


export default function AuthWrapper() {
  const { isSignedIn } = useUser();
  const { organization, isLoaded } = useOrganization();
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Set client state to true
    if (isLoaded && !isSignedIn) {
      // Check if user data is loaded and user is not signed in
      router.push('/sign-in'); // Redirect to sign-in page
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
