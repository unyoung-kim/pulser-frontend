"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ContentSettingsProps {
  projectId: string;
  contentId?: string | null;
}

export function ContentSettings({ projectId, contentId }: ContentSettingsProps) {
  const [existingKeywords, setExistingKeywords] = useState<string[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchKeywords();
  }, [projectId]);

  const fetchKeywords = async () => {
    const { data, error } = await supabase
      .from("Keyword")
      .select("keyword")
      .eq("project_id", projectId);

    if (!error && data) {
      setExistingKeywords(data.map((k) => k.keyword));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const keyword = selectedKeyword || newKeyword;
      if (!keyword || !topic) {
        throw new Error("Please provide both keyword and topic");
      }

      // Save new keyword if needed
      if (newKeyword) {
        await supabase.from("Keyword").insert({
          project_id: projectId,
          keyword: newKeyword,
        });
      }

      // Save or update content
      const contentData = {
        project_id: projectId,
        keyword: keyword,
        title: topic,
        status: "draft",
      };

      if (contentId) {
        await supabase
          .from("Content")
          .update(contentData)
          .eq("id", contentId);
      } else {
        const { data, error } = await supabase
          .from("Content")
          .insert(contentData)
          .select()
          .single();

        if (error) throw error;
        if (data) router.push(`/content/new?contentId=${data.id}&projectId=${projectId}`);
      }

      toast({
        title: "Success",
        description: "Content settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const keyword = selectedKeyword || newKeyword;
      if (!keyword || !topic) {
        throw new Error("Please provide both keyword and topic");
      }

      // Save first
      await handleSave();

      // Call backend
      const response = await fetch("https://pulser-backend.onrender.com/api/web-retrieval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          inputTopic: topic,
          keyword,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate content");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      toast({
        title: "Success",
        description: "Content generated successfully",
      });

      // Refresh the page to show content tab
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Keyword</Label>
            <div className="flex gap-4">
              <Select
                value={selectedKeyword}
                onValueChange={(value) => {
                  setSelectedKeyword(value);
                  setNewKeyword("");
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select keyword" />
                </SelectTrigger>
                <SelectContent>
                  {existingKeywords.map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex-1">
                <Input
                  placeholder="Or enter new keyword"
                  value={newKeyword}
                  onChange={(e) => {
                    setNewKeyword(e.target.value);
                    setSelectedKeyword("");
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topic</Label>
            <Input
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving || isGenerating}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isSaving || isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isGenerating ? "Generating..." : "Generate Content"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 