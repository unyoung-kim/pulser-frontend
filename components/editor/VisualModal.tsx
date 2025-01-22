'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Editor, generateHTML } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { visualList } from '@/constants/urlConstant';
import axios from '@/lib/axiosInstance';

interface VisualModalProps {
  editor: Editor;
  onClose: () => void;
}

export function VisualModal({ editor, onClose }: VisualModalProps) {
  const [selectedIMG, setSelectedIMG] = useState<string | null>(null);

  const { text, to } = useEditorState({
    editor,
    selector: (ctx) => {
      const { from, to } = ctx.editor.state.selection;
      const selectedNode = ctx.editor.state.doc.cut(from, to).toJSON();
      const selectedHTML = generateHTML(selectedNode, editor.extensionManager.extensions);

      return {
        text: selectedHTML,
        to,
      };
    },
  });

  const {
    data: visualData = [],
    isLoading,
    error,
  } = useQuery<string[], Error>({
    queryKey: ['fetchImages', text],
    queryFn: async () => {
      const response = await axios.post<{
        result: { data: { success: boolean; data: string[] } };
      }>(visualList, { text });
      return response.data.result.data.data;
    },
  });

  useEffect(() => {
    if (visualData.length > 0) {
      setSelectedIMG(visualData[0]);
    }
  }, [visualData]);

  const handleImageClick = useCallback((imgURL: string) => {
    setSelectedIMG(imgURL);
  }, []);

  const handleInsert = useCallback(() => {
    if (selectedIMG && to) {
      editor.commands.setImageBlockAt({ src: selectedIMG, pos: to });
      onClose();
    }
  }, [editor, onClose, to, selectedIMG]);

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Visual</DialogTitle>
        </DialogHeader>
        <div className="flex h-[500px] flex-col space-y-4">
          <div className="relative flex-grow overflow-hidden rounded-lg border bg-gray-100">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin accent-primary" />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500">
                <p className="text-center">{error.message ?? 'An error occurred'}</p>
              </div>
            ) : selectedIMG ? (
              <Image
                width={0}
                height={0}
                sizes="100%"
                src={selectedIMG}
                alt="Preview of selected visual"
                className="h-full w-full object-cover transition-opacity duration-300 ease-in-out"
                onError={() => setSelectedIMG(null)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                Select a visual from the options below
              </div>
            )}
          </div>
          <ScrollArea className="mt-4 h-[120px] w-full shrink-0">
            <div className="flex space-x-4 overflow-auto p-1">
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => <Skeleton key={index} className="h-24 w-24 rounded-md" />)
                : visualData?.map((source, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(source)}
                      className={`relative flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 hover:ring-2 hover:ring-blue-400 ${
                        selectedIMG === source ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <Image
                        width={96}
                        height={96}
                        src={source}
                        className="h-24 w-24 object-cover"
                        alt={`Visual option ${index + 1}`}
                      />
                      {selectedIMG === source && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-30">
                          <Check className="text-white" size={24} />
                        </div>
                      )}
                    </button>
                  ))}
            </div>
          </ScrollArea>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedIMG} className="px-6">
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
