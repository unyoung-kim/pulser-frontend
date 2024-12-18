"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  ArrowLeft,
  BookText,
  ChevronDown,
  FileText,
  Layout,
  Lightbulb,
  ListTree,
  Loader2,
  Pencil,
  Settings2,
  Sparkles,
  Tag,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea2";
import KeywordSelector from "./KeywordInput";

type LoadingStage = {
  label: string;
  isComplete: boolean;
  isLoading: boolean;
};

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
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingStages, setLoadingStages] = useState<LoadingStage[]>([
    {
      label: "Conducting web research",
      isLoading: true,
      isComplete: false,
    },
    { label: "Generating an outline", isLoading: false, isComplete: false },
    { label: "Writing Content", isLoading: false, isComplete: false },
    { label: "Humanizing Content", isLoading: false, isComplete: false },
    { label: "Optimizing for SEO", isLoading: false, isComplete: false },
  ]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [wordCount, setWordCount] = useState<number>(2500);
  const [outline, setOutline] = useState("");
  const [postLength, setPostLength] = useState<"SHORT" | "LONG">("LONG");

  useEffect(() => {
    setWordCount(contentType === "NORMAL" ? 2500 : 1000);
  }, [contentType]);

  const {
    data: keywords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["keyword", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Keyword")
        .select(`id, keyword, content_count:Content!fk_content_keyword(count)`)
        .eq("project_id", projectId);

      if (error) throw error;
      return data;
    },
    select: (data) =>
      data.map((k) => ({
        id: k.id,
        keyword: k.keyword,
        content_count: k.content_count,
      })),
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

  const usedKeywords: string[] = useMemo(
    () =>
      keywords
        .filter((k) => k.content_count.at(0)?.count > 0)
        .map((k) => k.keyword) ?? [],
    [keywords]
  );

  const unusedKeywords: string[] = useMemo(
    () =>
      keywords
        .filter((k) => k.content_count.at(0)?.count == 0)
        .map((k) => k.keyword) ?? [],
    [keywords]
  );

  const { refetch: fetchTopicSuggestions } = useQuery({
    queryKey: ["topic-suggestions", projectId, selectedKeyword],
    queryFn: async () => {
      if (!selectedKeyword) {
        toast({
          title: "Validation Error",
          description: "Please select a keyword first",
          variant: "destructive",
        });
        return;
      }

      setIsLoadingTopics(true);
      try {
        const backendUrl = "https://pulser-backend.onrender.com";
        // const backendUrl = "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/generate-topic`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            keyword: selectedKeyword,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch topic suggestions");
        }

        const data = await response.json();
        if (data.success && data.data) {
          const topics = JSON.parse(data.data);
          setTopicSuggestions(topics);
        } else {
          throw new Error(data.error || "Failed to generate topics");
        }
        return data;
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to generate topics",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTopics(false);
      }
    },
    enabled: false,
  });

  const calculateProgress = (stages: LoadingStage[]) => {
    const totalStages = stages.length;
    const completedStages = stages.filter((stage) => stage.isComplete).length;
    const hasLoadingStage = stages.some((stage) => stage.isLoading);

    // If there's a loading stage, add 0.5 to represent partial completion
    const progress =
      (completedStages + (hasLoadingStage ? 0.5 : 0)) / totalStages;
    return `${progress * 100}%`;
  };

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
    setShowLoadingModal(true);

    try {
      const selectedKeywordId = keywords.find(
        (k) => k.keyword === selectedKeyword
      )?.id;

      // Simulate progress through stages
      const updateStage = (index: number) => {
        setLoadingStages((prev) => {
          const newStages = [...prev];
          if (index > 0) {
            newStages[index - 1].isComplete = true;
            newStages[index - 1].isLoading = false;
          }
          if (index < newStages.length) {
            newStages[index].isLoading = true;
          }
          return newStages;
        });
      };

      // Update each stage every 10 seconds
      for (let i = 0; i < loadingStages.length; i++) {
        setTimeout(() => updateStage(i + 1), i * 10000);
      }

      // Start the content creation process
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
          wordCount: wordCount,
          length: postLength.toUpperCase(),
        }),
      });

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.message || responseData.error || "HTTP request failed"
        );
      }

      // Complete all stages only after API is finished
      setLoadingStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          isComplete: true,
          isLoading: false,
        }))
      );

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
      setShowLoadingModal(false);
    }
  };

  const topicSuggestionsSection = (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Pencil className="w-4 h-4 text-indigo-600" />
          Blog Title
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchTopicSuggestions()}
          className="text-indigo-600"
          disabled={isLoadingTopics || !selectedKeyword}
          title={!selectedKeyword ? "Please select a keyword first" : ""}
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {isLoadingTopics
            ? "Analyzing search trends..."
            : "Get AI suggestions"}
        </Button>
      </div>
      <Input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border-indigo-100 focus-visible:ring-indigo-600"
        placeholder="Enter your blog title here..."
      />

      {isLoadingTopics && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Analyzing Google search trends for high-intent topics...
        </div>
      )}

      {!isLoadingTopics && topicSuggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Suggested topics based on search trends:
          </p>
          <div className="flex flex-wrap gap-2">
            {topicSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => setTopic(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-gray-50/50 flex justify-center">
      <div className="max-w-3xl w-full py-10">
        <div className="mb-6">
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

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                Keyword
              </label>
              <KeywordSelector
                usedKeywords={usedKeywords}
                unusedKeywords={unusedKeywords}
                selectedKeyword={selectedKeyword}
                onKeywordChange={setSelectedKeyword}
                onCreateKeyword={createKeyword}
                isLoading={isLoading}
                error={error instanceof Error ? error.message : null}
              />
            </div>

            {topicSuggestionsSection}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">Advanced Settings</span>
              <Badge
                variant="secondary"
                className="text-xs font-normal text-muted-foreground"
              >
                Optional
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="text-indigo-600"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isAdvancedOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CardHeader>
          {isAdvancedOpen && (
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Post Length
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose the length of your blog post. This will affect the
                  overall structure and depth of the content.
                </p>
                <RadioGroup
                  defaultValue="LONG"
                  value={postLength}
                  onValueChange={(value: "SHORT" | "LONG") =>
                    setPostLength(value)
                  }
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Label
                    htmlFor="long"
                    className="flex flex-1 items-start space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                  >
                    <RadioGroupItem value="LONG" id="long" className="mt-1" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5" />
                        <span className="font-medium">Long</span>
                        <Badge
                          variant="secondary"
                          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 ml-2"
                        >
                          Recommended for SEO
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Covers the main topic and other related topics (2500+
                        words)
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="short"
                    className="flex flex-1 items-start space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                  >
                    <RadioGroupItem value="SHORT" id="short" className="mt-1" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span className="font-medium">Short</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Only covers the main topic (1000-1500 words)
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {/* <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TextQuote className="w-4 h-4 text-indigo-600" />
                  Word Counts
                </Label>
                <Input
                  type="number"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="border-indigo-100 focus-visible:ring-indigo-600"
                  min={100}
                  max={3000}
                />
                <p className="text-sm text-muted-foreground">
                  We recommend {contentType === "NORMAL" ? "2,500" : "1,000"}{" "}
                  words for{" "}
                  {contentType === "NORMAL"
                    ? "optimal SEO performance"
                    : "glossary entries"}{" "}
                  (min: 100, max: 3000)
                </p>
              </div> */}

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Instructions / Outline
                </Label>
                <Textarea
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  className="border-indigo-100 focus-visible:ring-indigo-600 min-h-[100px]"
                  placeholder="Optional: Add specific instructions or outline for the content..."
                />
                <p className="text-sm text-muted-foreground">
                  Add any specific requirements or outline for the content
                  structure
                </p>
              </div>
            </CardContent>
          )}
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

        <Dialog open={showLoadingModal} onOpenChange={setShowLoadingModal}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">
                  Generating Content
                </DialogTitle>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowLoadingModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button> */}
              </div>
              <DialogDescription className="text-base">
                Please don&apos;t leave this page. You can switch browser tabs
                while we work on your content. This process may take up to 5
                minutes.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {loadingStages.map((stage, index) => {
                const isActive = stage.isLoading;
                const isComplete = stage.isComplete;
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      isActive && "bg-indigo-50 animate-pulse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                        isActive &&
                          "border-indigo-600 bg-indigo-600 text-white",
                        isComplete &&
                          "border-indigo-600/50 bg-indigo-100 text-indigo-600",
                        !isActive && !isComplete && "border-gray-200"
                      )}
                    >
                      {index === 0 && <Activity className="h-4 w-4" />}
                      {index === 1 && <BookText className="h-4 w-4" />}
                      {index === 2 && <Pencil className="h-4 w-4" />}
                      {index === 3 && <Sparkles className="h-4 w-4" />}
                      {index === 4 && <Tag className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isActive && "text-indigo-600",
                          isComplete && "text-muted-foreground"
                        )}
                      >
                        {stage.label}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full transition-colors",
                        isActive &&
                          "bg-indigo-600 animate-[pulse_2s_ease-in-out_infinite]",
                        isComplete && "bg-indigo-600/50",
                        !isActive && !isComplete && "bg-secondary-foreground/20"
                      )}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-1000 ease-in-out"
                style={{ width: calculateProgress(loadingStages) }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
