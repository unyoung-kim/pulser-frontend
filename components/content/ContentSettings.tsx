'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { generateTopic, webRetrieval } from '@/constants/urlConstant';
import { useToast } from '@/hooks/use-toast';
import { useGetKeywords } from '@/lib/apiHooks/keyword/useGetKeywords';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Activity,
  AlertTriangle,
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
  Type,
  Upload,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea2';
import KeywordSelector from './KeywordInput';

type LoadingStage = {
  label: string;
  isComplete: boolean;
  isLoading: boolean;
};

// Create separate loading stage configurations
const normalLoadingStages: LoadingStage[] = [
  { label: 'Conducting web research', isLoading: true, isComplete: false },
  { label: 'Generating an outline', isLoading: false, isComplete: false },
  { label: 'Writing Content', isLoading: false, isComplete: false },
  { label: 'Humanizing Content', isLoading: false, isComplete: false },
  { label: 'Optimizing for SEO', isLoading: false, isComplete: false },
];

const glossaryLoadingStages: LoadingStage[] = [
  { label: 'Generating an outline', isLoading: true, isComplete: false },
  { label: 'Writing Content', isLoading: false, isComplete: false },
  { label: 'Humanizing Content', isLoading: false, isComplete: false },
  { label: 'Optimizing for SEO', isLoading: false, isComplete: false },
];

export default function ContentSettings() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'NORMAL' | 'GLOSSARY' | 'FILES'>('NORMAL');
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingStages, setLoadingStages] = useState<LoadingStage[]>(normalLoadingStages);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [wordCount, setWordCount] = useState<number>(2500);
  const [outline, setOutline] = useState('');
  const [postLength, setPostLength] = useState<'SHORT' | 'LONG'>('LONG');
  const { orgId } = useAuth();
  const [contentItems, setContentItems] = useState<
    Array<{
      type: 'file' | 'text';
      content: string;
      instructions: string;
      title: string;
    }>
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');

  useEffect(() => {
    setWordCount(contentType === 'NORMAL' ? 2500 : 1000);
  }, [contentType]);

  const { data: keywords = [] } = useGetKeywords(projectId);

  const { refetch: fetchTopicSuggestions } = useQuery({
    queryKey: ['topic-suggestions', projectId, selectedKeyword],
    queryFn: async () => {
      if (!selectedKeyword) {
        toast({
          title: 'Validation Error',
          description: 'Please select a keyword first',
          variant: 'destructive',
        });
        return;
      }

      const word = keywords.find((k) => k.id === selectedKeyword)?.keyword;

      setIsLoadingTopics(true);

      try {
        const response = await axios.post(generateTopic, {
          projectId,
          keyword: word,
        });

        if (response.data.success && response.data.data) {
          const topics = JSON.parse(response.data.data);
          setTopicSuggestions(topics);
        } else {
          throw new Error(response.data.error || 'Failed to generate topics');
        }

        return response.data;
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to generate topics',
          variant: 'destructive',
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
    const progress = (completedStages + (hasLoadingStage ? 0.5 : 0)) / totalStages;
    return `${progress * 100}%`;
  };

  const handleCreateContent = async () => {
    if (!selectedKeyword) {
      toast({
        title: 'Validation Error',
        description: 'Please select a keyword',
        variant: 'destructive',
      });
      return;
    }

    if (!projectId) {
      toast({
        title: 'Error',
        description: 'No project selected',
        variant: 'destructive',
      });
      return;
    }

    if (!topic.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a topic',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    setShowLoadingModal(true);

    try {
      // Reset loading stages based on content type
      const stages = contentType === 'GLOSSARY' ? glossaryLoadingStages : normalLoadingStages;
      setLoadingStages(stages);

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

      // Start with first stage
      updateStage(0);

      // Update subsequent stages with different timing based on content type
      const transitionTime = contentType === 'GLOSSARY' ? 6000 : 15000;
      for (let i = 1; i < stages.length; i++) {
        setTimeout(() => updateStage(i), i * transitionTime);
      }

      // Start the content creation process
      const response = await fetch(webRetrieval, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId,
          inputTopic: topic.trim(),
          keywordId: selectedKeyword,
          type: contentType,
          secondaryKeywords: secondaryKeywords.split(',').map((kw) => kw.trim()),
          outline: outline.trim(),
          wordCount: wordCount,
          length: postLength.toUpperCase(),
        }),
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'HTTP request failed');
      }

      // Complete all stages only after API is finished
      setLoadingStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          isComplete: true,
          isLoading: false,
        }))
      );

      router.push(`/projects/${projectId}/content`);
    } catch (error) {
      console.error('Error creating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to create content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
      setShowLoadingModal(false);
    }
  };

  const topicSuggestionsSection = (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Pencil className="h-4 w-4 text-indigo-600" />
          Blog Title
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchTopicSuggestions()}
          className="text-indigo-600"
          disabled={isLoadingTopics || !selectedKeyword}
          title={!selectedKeyword ? 'Please select a keyword first' : ''}
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          {isLoadingTopics ? 'Analyzing search trends...' : 'Get AI suggestions'}
        </Button>
      </div>
      <Input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border-indigo-100 focus-visible:ring-indigo-600"
        placeholder="Enter your blog title here..."
      />

      {isLoadingTopics && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyzing Google search trends for high-intent topics...
        </div>
      )}

      {!isLoadingTopics && topicSuggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Suggested topics based on search trends:</p>
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

  const { data: usage } = useQuery<{
    credits_charged: number;
    additional_credits_charged: number;
    credits_used: number;
  }>({
    queryKey: ['usage', orgId],
    queryFn: async () => {
      if (!orgId) throw new Error('No organization ID found');

      // First, get the organization and its current_usage_id
      const { data: orgData, error: orgError } = await supabase
        .from('Organization')
        .select('current_usage_id')
        .eq('org_id', orgId)
        .single();

      if (orgError) throw orgError;

      // Then fetch the usage data using the current_usage_id
      const { data, error } = await supabase
        .from('Usage')
        .select('credits_charged, additional_credits_charged, credits_used')
        .eq('id', orgData.current_usage_id)
        .single();

      if (error) throw error;

      return {
        credits_charged: data?.credits_charged || 0,
        additional_credits_charged: data?.additional_credits_charged || 0,
        credits_used: data?.credits_used || 0,
      };
    },
    enabled: !!orgId,
  });

  const totalCredits = usage ? usage.credits_charged + usage.additional_credits_charged : 0;
  const remainingCredits = totalCredits - (usage?.credits_used || 0);
  const requiredCredits = contentType === 'NORMAL' ? 3 : 1;
  const hasEnoughCredits = remainingCredits >= requiredCredits;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file) => {
      setContentItems((prev) => [
        ...prev,
        { type: 'file', content: file.name, instructions: '', title: '' },
      ]);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      selectedFiles.forEach((file) => {
        setContentItems((prev) => [
          ...prev,
          { type: 'file', content: file.name, instructions: '', title: '' },
        ]);
      });
    }
  };

  const handleTextSubmit = () => {
    if (pastedText.trim()) {
      setContentItems((prev) => [
        ...prev,
        { type: 'text', content: pastedText, instructions: '', title: '' },
      ]);
      setPastedText('');
    }
  };

  const removeItem = (index: number) => {
    setContentItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInstructions = (index: number, instructions: string) => {
    setContentItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, instructions } : item))
    );
  };

  const updateTitle = (index: number, title: string) => {
    setContentItems((prev) => prev.map((item, i) => (i === index ? { ...item, title } : item)));
  };

  return (
    <div className="flex w-full justify-center bg-gray-50/50">
      <div className="w-full max-w-4xl py-10">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                1
              </div>
              <span className="font-medium">Content Settings</span>
            </div>
            <Separator className="flex-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border">2</div>
              <span>Edit Content</span>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="text-lg font-semibold">Blog Settings</CardHeader>

          {!hasEnoughCredits && (
            <div className="-mt-2 mb-4 px-6">
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  You have {remainingCredits} credits remaining.
                  <Link
                    href={`/projects/${projectId}/settings`}
                    className="text-indigo-600 hover:underline"
                  >
                    {' '}
                    Add more credits
                  </Link>
                </span>
              </div>
            </div>
          )}
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Layout className="h-4 w-4 text-indigo-600" />
                Content Type
              </Label>
              <p className="text-sm text-muted-foreground">
                Both options will be SEO-optimized & customized to your business.
              </p>
              <RadioGroup
                defaultValue="normal"
                value={contentType}
                onValueChange={(value: 'NORMAL' | 'GLOSSARY' | 'FILES') => setContentType(value)}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Label
                  htmlFor="normal"
                  className="flex flex-1 cursor-pointer items-start space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-indigo-600"
                >
                  <RadioGroupItem value="NORMAL" id="normal" className="mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <BookText className="h-5 w-5" />
                      <span className="font-medium">Normal</span>
                      <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-100">
                        3 Credits
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Standard SEO blog article
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="glossary"
                  className="flex flex-1 cursor-pointer items-start space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-indigo-600"
                >
                  <RadioGroupItem value="GLOSSARY" id="glossary" className="mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <ListTree className="h-5 w-5" />
                      <span className="font-medium">Glossary</span>
                      <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-100">
                        1 Credit
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      SEO article defining and explaining industry-specific terms.
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="files"
                  className="flex flex-1 cursor-pointer items-start space-x-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-indigo-600"
                >
                  <RadioGroupItem value="FILES" id="files" className="mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span className="font-medium">Files to Article</span>
                      <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-100">
                        3 Credits
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Convert files or text into a blog article
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <Separator className="my-6" />

            {contentType === 'FILES' && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  We&apos;ll analyze your source content and transform it into an SEO-optimized blog
                  article while maintaining the key information and context.
                </p>

                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center gap-2">
                      <Upload className="h-5 w-5 text-indigo-600" />
                      <h2 className="text-lg font-semibold">Upload Files</h2>
                    </div>

                    <div
                      className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-muted-foreground/25'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                        id="file-upload"
                      />
                      <Label
                        htmlFor="file-upload"
                        className="flex cursor-pointer flex-col items-center gap-2"
                      >
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <p className="text-lg font-medium">Drop files here or click to upload</p>
                        <p className="text-sm text-muted-foreground">
                          Supports documents, PDFs, and text files
                        </p>
                      </Label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                      OR
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Type className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold">Paste Text</h2>
                      </div>
                      <Button
                        onClick={handleTextSubmit}
                        // className="bg-indigo-600 hover:bg-indigo-700"
                        variant="outline"
                      >
                        Add Text
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Paste your text here..."
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      className="max-h-[165px] min-h-[165px] flex-1"
                    />
                  </div>
                </div>

                {contentItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">Uploaded Content</h3>
                      <Badge variant="secondary" className="bg-gray-100">
                        {contentItems.length}
                      </Badge>
                    </div>
                    {contentItems.map((item, index) => (
                      <Card key={index} className="space-y-2 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.type === 'file' ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <Type className="h-4 w-4" />
                            )}
                            <span className="max-w-[300px] truncate font-medium">
                              {item.content}
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="(Optional) Add a title for this content..."
                          value={item.title}
                          onChange={(e) => updateTitle(index, e.target.value)}
                          className="mt-2"
                        />
                        <Textarea
                          placeholder="(Optional) Add instructions for this content..."
                          value={item.instructions}
                          onChange={(e) => updateInstructions(index, e.target.value)}
                          className="mt-2"
                        />
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {contentType !== 'FILES' && (
              <>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-indigo-600" />
                    Keyword
                  </label>
                  <KeywordSelector
                    selectedKeyword={selectedKeyword}
                    onKeywordChange={setSelectedKeyword}
                  />
                </div>

                {topicSuggestionsSection}
              </>
            )}
          </CardContent>
        </Card>

        {contentType !== 'FILES' && (
          <Card className="mt-4 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Advanced Settings</span>
                <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
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
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isAdvancedOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CardHeader>
            {isAdvancedOpen && (
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    Instructions / Outline
                  </Label>
                  <Textarea
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    className="min-h-[100px] border-indigo-100 focus-visible:ring-indigo-600"
                    placeholder="Optional: Add specific instructions or outline for the content..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Add any specific requirements or outline for the content structure
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            ⚡ Content generation may take up to 5 minutes.
          </p>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-indigo-600"
              onClick={() => router.push(`/projects/${projectId}/content`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleCreateContent}
              disabled={isCreating || !selectedKeyword || !topic.trim() || !hasEnoughCredits}
              title={!hasEnoughCredits ? 'Not enough credits available' : ''}
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isCreating ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>
        </div>

        <Dialog open={showLoadingModal} onOpenChange={setShowLoadingModal}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">Generating Content</DialogTitle>
              </div>
              <DialogDescription className="text-base">
                Please don&apos;t leave this page. You can switch browser tabs while we work on your
                content. This process may take up to 5 minutes.
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
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                      isActive && 'animate-pulse bg-indigo-50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                        isActive && 'border-indigo-600 bg-indigo-600 text-white',
                        isComplete && 'border-indigo-600/50 bg-indigo-100 text-indigo-600',
                        !isActive && !isComplete && 'border-gray-200'
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
                          'text-sm font-medium',
                          isActive && 'text-indigo-600',
                          isComplete && 'text-muted-foreground'
                        )}
                      >
                        {stage.label}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full transition-colors',
                        isActive && 'animate-[pulse_2s_ease-in-out_infinite] bg-indigo-600',
                        isComplete && 'bg-indigo-600/50',
                        !isActive && !isComplete && 'bg-secondary-foreground/20'
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
