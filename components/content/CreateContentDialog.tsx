'use client';

import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keywords: string[];
  topic: string;
  onKeywordsChange: (keywords: string[]) => void;
  onTopicChange: (value: string) => void;
  onSubmit: () => void;
  isCreating: boolean;
}

export function CreateContentDialog({
  open,
  onOpenChange,
  keywords,
  topic,
  onKeywordsChange,
  onTopicChange,
  onSubmit,
  isCreating,
}: CreateContentDialogProps) {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = useCallback(() => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      onKeywordsChange([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  }, [newKeyword, keywords, onKeywordsChange]);

  const handleRemoveKeyword = useCallback(
    (keywordToRemove: string) => {
      onKeywordsChange(keywords.filter((k) => k !== keywordToRemove));
    },
    [keywords, onKeywordsChange]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddKeyword();
      }
    },
    [handleAddKeyword]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {isCreating ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-b-transparent" />
            <div className="space-y-2 text-center">
              <h3 className="font-semibold">Generating Content</h3>
              <p className="text-sm text-muted-foreground">
                This process may take up to 10 minutes. Please keep this window open.
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
              <DialogDescription>
                Enter keywords and topic to generate content. At least one keyword is required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    placeholder="Enter keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    onClick={handleAddKeyword}
                    disabled={!newKeyword.trim()}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {keywords.map((kw, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm"
                      >
                        <span>{kw}</span>
                        <button
                          onClick={() => handleRemoveKeyword(kw)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter content topic"
                  value={topic}
                  onChange={(e) => onTopicChange(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={keywords.length === 0}>
                Create Content
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
