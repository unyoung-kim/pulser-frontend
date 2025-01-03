import { ToastActionElement } from '@/components/ui/toast';
import { BACKEND_URL } from '@/lib/api/backend';
import { Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
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

export const AutofillDialog = ({
  isOpen,
  onClose,
  projectId,
  initialUrl,
  onSuccess,
  toast,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  initialUrl: string;
  onSuccess: (data: any) => void;
  toast: (props: ToastProps) => void;
}) => {
  const [autofillUrl, setAutofillUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAutofillUrl(initialUrl);
    }
  }, [isOpen, initialUrl]);

  const handleAutofill = async () => {
    if (!isValidUrl(autofillUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/autofill-background`, {
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
      console.log('Raw data', rawData);
      const result = AutofillResponse.parse(rawData);
      console.log('Result', result);

      if (!result.result.data.success || !result.result.data.data) {
        throw new Error(result.result.data.error || 'Failed to autofill');
      }

      onSuccess(result.result.data);
      toast({
        title: '🎉 Success',
        description: 'Content was successfully autofilled with AI ✅',
      });
      onClose();
    } catch (error) {
      console.log('Error', error);
      toast({
        title: 'Error',
        description: 'Failed to autofill content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};
