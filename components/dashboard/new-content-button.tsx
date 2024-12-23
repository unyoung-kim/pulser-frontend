"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export function NewContentButton() {
  const [isHovered, setIsHovered] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams?.get("projectId") || "";

  return (
    <Button
      className={cn(
        "w-full justify-between transition-all duration-300 ease-in-out",
        "bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500",
        "text-white font-semibold py-2 px-4 rounded-lg shadow-lg",
        "border border-transparent hover:border-indigo-200",
        isHovered ? "shadow-xl shadow-indigo-300/20 scale-105" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/content/settings?projectId=${projectId}`)}
    >
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center">
          <Sparkles
            className={cn(
              "h-4 w-4 mr-2 transition-transform duration-300",
              isHovered ? "animate-pulse duration-1000" : ""
            )}
          />
          <span>New Content</span>
        </span>
        <Plus
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isHovered ? "animate-pulse duration-1000" : ""
          )}
        />
      </div>
    </Button>
  );
}
