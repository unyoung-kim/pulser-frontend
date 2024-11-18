'use client';

import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Wand2, ShrinkIcon, StretchHorizontalIcon, SpellCheck2Icon, PenToolIcon } from 'lucide-react';

interface FloatingAIToolbarProps {
  editor: Editor;
  isDisabled: boolean;
}

export function FloatingAIToolbar({ editor, isDisabled }: FloatingAIToolbarProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const updatePosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShow(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position the toolbar above the selection
    setPosition({
      x: rect.left + window.scrollX + (rect.width / 2) - 125, // Center horizontally
      y: rect.top + window.scrollY - 50, // Position above selection
    });

    // Only show if there's actual text selected
    setShow(!editor.state.selection.empty);
  }, [editor]);

  useEffect(() => {
    const handleSelectionChange = () => {
      updatePosition();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  if (!show) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().aiRephrase().run()}
            disabled={isDisabled}
            className="hover:bg-purple-50 hover:text-purple-600 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700 transition-colors"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Rephrase</p>
            <p className="text-xs text-gray-300">Rewrite selected text</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().aiShorten().run()}
            disabled={isDisabled}
            className="hover:bg-blue-50 hover:text-blue-600 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 transition-colors"
          >
            <ShrinkIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Make Concise</p>
            <p className="text-xs text-gray-300">Shorten text</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().aiExtend().run()}
            disabled={isDisabled}
            className="hover:bg-green-50 hover:text-green-600 data-[state=on]:bg-green-100 data-[state=on]:text-green-700 transition-colors"
          >
            <StretchHorizontalIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Expand</p>
            <p className="text-xs text-gray-300">Add more details</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().aiFixSpellingAndGrammar().run()}
            disabled={isDisabled}
            className="hover:bg-amber-50 hover:text-amber-600 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700 transition-colors"
          >
            <SpellCheck2Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Fix Writing</p>
            <p className="text-xs text-gray-300">Fix grammar</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
} 