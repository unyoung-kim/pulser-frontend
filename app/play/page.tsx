import Dashboard from "@/components/ContentMain";
import { useRestrictedAccess } from "@/hooks/useRestrictedAccess";
import { Loader } from "@/components/ui/loader";

export default function Home() {
  const { isLoading, isRestricted } = useRestrictedAccess();

  if (isLoading) {
    return <Loader />;
  }

  if (isRestricted) {
    return null; // The hook will handle redirection
  }

  return <Dashboard />;
}
