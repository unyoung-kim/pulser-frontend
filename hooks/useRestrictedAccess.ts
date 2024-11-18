import { useUser, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRestrictedAccess() {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoaded || !isOrgLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (!organization) {
      router.push("/");
      return;
    }
  }, [isSignedIn, isUserLoaded, organization, isOrgLoaded, router]);

  return {
    isLoading: !isUserLoaded || !isOrgLoaded,
    isRestricted: !isSignedIn || !organization
  };
} 