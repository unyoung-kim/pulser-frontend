import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import KeywordDashboard from "./KeywordDashboard";

export default function KeywordMain() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-1 text-center p-4">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Error: Project is not selected
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Please make sure you&apos;ve selected a project.
          </p>
          <Button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => (window.location.href = "/")}
          >
            Go to Projects
          </Button>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold leading-7 text-gray-900">Keyword</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Search for and manage keywords for your articles.
        </p>
      </div>
      <Separator className="" />
      <div className="mt-2">
        <KeywordDashboard />
      </div>
    </>
  );
}
