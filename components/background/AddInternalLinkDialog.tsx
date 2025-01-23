import { useState } from 'react';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea2';

interface AddInternalLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, summary: string) => void;
}

export function AddInternalLinkDialog({ isOpen, onClose, onAdd }: AddInternalLinkDialogProps) {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(url, summary);
    setUrl('');
    setSummary('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Internal Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                required
              />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                className="min-h-36"
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of the page content"
              />
            </div>
          </div>
          <AlertDialogFooter className="mt-4">
            <Button type="submit">Add Link</Button>
          </AlertDialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
