import { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { ToastActionElement } from '@/components/ui/toast';
import { autofillBackgroundUrl } from '@/constants/urlConstant';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ToastActionElement;
};

const AutofillResponse = z.object({
  result: z.object({
    data: z.object({
      success: z.boolean(),
      data: z.unknown().optional(),
      error: z.string().optional(),
    }),
  }),
});

type AutofillResponseType = z.infer<typeof AutofillResponse>;

const InternalLinksPrompt = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Find Internal Links
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              Highly Recommended
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Would you like to scan your website for internal links? This helps improve SEO by
            naturally incorporating your existing pages into the generated content.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Skip for now
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={onConfirm}>
            Yes, find internal links
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AutofillDialog = ({
  isOpen,
  onClose,
  projectId,
  initialUrl,
  onSuccess,
  toast,
  internalLinksCount = 0,
  onInternalLinksPrompt,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  initialUrl: string;
  onSuccess: (data: any) => void;
  toast: (props: ToastProps) => void;
  internalLinksCount?: number;
  onInternalLinksPrompt?: () => void;
}) => {
  const [autofillUrl, setAutofillUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [showInternalLinksPrompt, setShowInternalLinksPrompt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAutofillUrl(initialUrl);
    }
  }, [isOpen, initialUrl]);

  const handleAutofill = async () => {
    if (!isValidUrl(autofillUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL that starts with https://..',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(autofillBackgroundUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          companyUrl: autofillUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to autofill');
      }

      const rawData = await response.json();
      const result = AutofillResponse.parse(rawData);

      if (!result.result.data.success || !result.result.data.data) {
        throw new Error(result.result.data.error || 'Failed to autofill');
      }

      onSuccess(result.result.data);
      toast({
        title: '🎉 Success',
        description: 'Content was successfully autofilled with AI ✅',
      });
      // Close the autofill dialog first
      onClose();

      // Add a small delay before showing the internal links prompt
      setTimeout(() => {
        if (internalLinksCount === 0) {
          setShowInternalLinksPrompt(true);
        }
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to autofill content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInternalLinksConfirm = () => {
    setShowInternalLinksPrompt(false);
    onInternalLinksPrompt?.();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autofill with AI</DialogTitle>
            <DialogDescription>
              Enter your company URL to automatically fill in the information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Company URL</Label>

              <Input
                id="url"
                placeholder="https://example.com"
                value={autofillUrl}
                onChange={(e) => setAutofillUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">URL must include https:// prefix</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              onClick={handleAutofill}
              disabled={isLoading || !autofillUrl}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Autofilling...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Autofill
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <InternalLinksPrompt
        isOpen={showInternalLinksPrompt}
        onClose={() => setShowInternalLinksPrompt(false)}
        onConfirm={handleInternalLinksConfirm}
      />
    </>
  );
};
