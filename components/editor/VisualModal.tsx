"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Editor } from "@tiptap/core";
import Image from "next/image";

interface VisualModalProps {
  editor: Editor;
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

interface ImageResult {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export function VisualModal({ editor, onSelect, onClose }: VisualModalProps) {
  const [selectedIMG, setSelectedIMG] = React.useState<string | null>(null);
  const [visualData, setVisualData] = React.useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSwitching, setIsSwitching] = React.useState(false);

  const handleImageClick = (imgURL: string) => {
    setIsSwitching(true);
    setSelectedIMG(imgURL);
    setTimeout(() => setIsSwitching(false), 500); // Simulate image loading time
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://picsum.photos/v2/list?page=2&limit=5"
        );
        const data = await response.json();
        setVisualData(data);
        if (data.length > 0) {
          setSelectedIMG(data[0].download_url);
        }
      } catch (error) {
        setError("Error fetching images. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 my-1">
            Add Visuals to your content
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[500px]">
          <div className="flex-grow relative border rounded-md overflow-hidden">
            {isLoading || isSwitching ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-200"></div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-red-500">
                {error}
              </div>
            ) : selectedIMG ? (
              <img
                src={selectedIMG}
                alt="preview visuals"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Select Visual below
              </div>
            )}
          </div>
          <ScrollArea className="h-[100px] shrink-0 w-full mt-4 overflow-x-auto">
            <div className="flex space-x-2 pb-4">
              {visualData.length > 0 &&
                visualData.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(img.download_url)}
                    className={`flex-shrink-0 border rounded-md overflow-hidden hover:opacity-80 p-2 ${
                      selectedIMG === img.download_url ? "border-blue-500" : ""
                    }`}
                  >
                    <Image
                      width={64}
                      height={64}
                      src={img.download_url}
                      className="w-16 h-16"
                      alt="Visual"
                    />
                  </button>
                ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline" className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedIMG) {
                onSelect(selectedIMG);
              }
            }}
            disabled={!selectedIMG}
          >
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
