'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Editor } from '@tiptap/core';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';
import axios from '@/lib/axiosInstance';
import { visualList } from '@/constants/urlConstant';

interface VisualModalProps {
  editor: Editor;
  onClose: () => void;
}

export function VisualModal({ editor, onClose }: VisualModalProps) {
  const [selectedIMG, setSelectedIMG] = useState<string | null>(null);

  const text = editor.storage.showVisualEvent.text;
  const savedSelection = editor.storage.showVisualEvent.savedSelection;

  const {
    data: visualData = [],
    isLoading,
    error,
  } = useQuery<string[], Error>({
    queryKey: ['fetchImages', text],
    queryFn: async () => {
      const response = await axios.post<{
        result: { data: { success: boolean; data: string[] } }
      }>(visualList, { text });
      return response.data.result.data.data;
    },
  });

  useEffect(() => {
    if (visualData.length > 0) {
      setSelectedIMG(visualData[0]);
    }
  }, [visualData]);

  const handleImageClick = (imgURL: string) => {
    setSelectedIMG(imgURL);
  };

  const handleInsert = () => {
    if (selectedIMG && savedSelection) {
      editor.commands.insertContentAt(savedSelection.to, {
        type: 'image',
        attrs: {
          src: selectedIMG,
        },
      });
      editor.chain().focus().setSavedSelection({ from: 0, to: 0 }).run();
      onClose();
    }
  };

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add Visual
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[500px] space-y-4">
          <div className="flex-grow relative border rounded-lg overflow-hidden bg-gray-100">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : error ? (
              <div
                className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500">
                <p className="text-center">
                  {error.message ?? 'An error occurred'}
                </p>
              </div>
            ) : selectedIMG ? (
              <Image
                width={0}
                height={0}
                sizes="100%"
                src={selectedIMG}
                alt="Preview of selected visual"
                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                onError={() => setSelectedIMG(null)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Select a visual from the options below
              </div>
            )}
          </div>
          <ScrollArea className="h-[120px] w-full shrink-0 mt-4">
            <div className="flex space-x-4 p-1 overflow-auto">
              {isLoading
                ? Array(5).fill(0).map((_, index) => (
                  <Skeleton key={index} className="w-24 h-24 rounded-md" />
                ))
                : visualData?.map((source, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(source)}
                    className={`relative flex-shrink-0 rounded-md overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all duration-200 ${
                      selectedIMG === source ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      width={96}
                      height={96}
                      src={source}
                      className="w-24 h-24 object-cover"
                      alt={`Visual option ${index + 1}`}
                    />
                    {selectedIMG === source && (
                      <div
                        className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                        <Check className="text-white" size={24} />
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
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
