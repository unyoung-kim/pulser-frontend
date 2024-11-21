"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookText,
  Layout,
  ListTree,
  Loader2,
  Pencil,
  Sparkles,
  Tag,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import KeywordSelector from "./KeywordInput";

export default function ContentSettings() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") || "";
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<"NORMAL" | "GLOSSARY">(
    "NORMAL"
  );
  const [selectedKeyword, setSelectedKeyword] = useState("");

  const {
    data: keywords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["keyword", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Keyword")
        .select("id, keyword")
        .eq("project_id", projectId);

      if (error) throw error;
      return data;
    },
    select: (data) => data.map((k) => ({ id: k.id, keyword: k.keyword })),
  });

  const { mutate: createKeyword } = useMutation({
    mutationFn: async (keyword: string) => {
      const { data, error } = await supabase
        .from("Keyword")
        .insert([
          {
            keyword,
            project_id: projectId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch keywords
      queryClient.invalidateQueries({ queryKey: ["keyword", projectId] });
    },
  });

  const handleCreateContent = async () => {
    if (!selectedKeyword) {
      toast({
        title: "Validation Error",
        description: "Please select a keyword",
        variant: "destructive",
      });
      return;
    }

    if (!projectId) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const selectedKeywordId = keywords.find(
        (k) => k.keyword === selectedKeyword
      )?.id;

      // console.log(
      //   JSON.stringify({
      //     projectId: projectId,
      //     inputTopic: topic,
      //     keywordId: selectedKeywordId,
      //     keyword: selectedKeyword,
      //     type: contentType,
      //   })
      // );

      const backendUrl = "https://pulser-backend.onrender.com";
      // const backendUrl = "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/web-retrieval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
          inputTopic: topic,
          keywordId: selectedKeywordId,
          type: contentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to generate content: ",
          errorData
        );
      }

      const { success, data, error } = await response.json();

      if (!success) {
        throw new Error(error || "Failed to generate content" || data);
      }

      // Navigate back to content page after successful creation
      router.push(`/content?projectId=${projectId}`);
    } catch (error) {
      console.error("Error creating content:", error);
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full bg-gray-50/50 flex justify-center">
      <div className="max-w-3xl w-full py-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                1
              </div>
              <span className="font-medium">Content Settings</span>
            </div>
            <Separator className="flex-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                2
              </div>
              <span>Edit Content</span>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="text-lg font-semibold">
            Blog Settings
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                Keyword
              </label>
              <KeywordSelector
                keywords={keywords.map((k) => k.keyword)}
                selectedKeyword={selectedKeyword}
                onKeywordChange={setSelectedKeyword}
                onCreateKeyword={createKeyword}
                isLoading={isLoading}
                error={error instanceof Error ? error.message : null}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                Blog Title
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="border-indigo-100 focus-visible:ring-indigo-600"
                placeholder="Enter your blog title here..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Layout className="w-4 h-4 text-indigo-600" />
                Content Type
              </Label>
              <p className="text-sm text-muted-foreground">
                Both options will be SEO-optimized & customized to your
                business.
              </p>
              <RadioGroup
                defaultValue="normal"
                value={contentType}
                onValueChange={(value: "NORMAL" | "GLOSSARY") =>
                  setContentType(value)
                }
                className="flex flex-col sm:flex-row gap-4"
              >
                <Label
                  htmlFor="normal"
                  className="flex flex-1 items-start space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                >
                  <RadioGroupItem value="NORMAL" id="normal" className="mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <BookText className="h-5 w-5" />
                      <span className="font-medium">Normal</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Standard SEO blog article
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="glossary"
                  className="flex flex-1 items-start space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                >
                  <RadioGroupItem
                    value="GLOSSARY"
                    id="glossary"
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <ListTree className="h-5 w-5" />
                      <span className="font-medium">Glossary</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      SEO article defining and explaining industry-specific
                      terms.
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            ⚡ Content generation may take up to 5 minutes.
          </p>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-indigo-600"
              onClick={() => router.push(`/content?projectId=${projectId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go back
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleCreateContent}
              disabled={isCreating || !selectedKeyword || !topic.trim()}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isCreating ? "Generating..." : "Generate Content"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
