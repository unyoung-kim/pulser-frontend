import { useState, useEffect } from 'react';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea2';

interface EditInternalLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, url: string, summary: string) => void;
  link: { id: string; url: string; summary?: string } | null;
}

export function EditInternalLinkDialog({
  isOpen,
  onClose,
  onEdit,
  link,
}: EditInternalLinkDialogProps) {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (link) {
      setUrl(link.url);
      setSummary(link.summary || '');
    }
  }, [link]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (link) {
      onEdit(link.id, url, summary);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Internal Link</DialogTitle>
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
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of the page content"
              />
            </div>
          </div>
          <AlertDialogFooter className="mt-4">
            <Button type="submit">Save Changes</Button>
          </AlertDialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
