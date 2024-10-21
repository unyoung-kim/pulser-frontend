'use client';

import { SignIn, UserButton } from "@clerk/nextjs";
import { useUser, useOrganization } from "@clerk/nextjs";
import { CreateOrganization } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import ProjectSection from './ProjectSection';
import { Loader } from "@/components/ui/loader"; // Import the Loader component

export default function AuthWrapper() {
  const { isSignedIn, user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isLoaded) {
    return <Loader />; // Use the Loader component instead of the text
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Pulser</h1>
        <SignIn routing="path" path="/sign-in" />
      </div>
    );
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
