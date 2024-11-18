"use client";

import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const updatePosition = useCallback(() => {
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Only show if there's actual text selected
    if (selection.toString().length > 0 && !editor.state.selection.empty) {
      setShow(true);
      setPosition({
        x: rect.left + (rect.width / 2),
        y: rect.top - 10, // Position slightly above the selection
      });
    } else {
      setShow(false);
    }
  }, [editor]);

  useEffect(() => {
    const handleSelectionChange = () => {
      requestAnimationFrame(updatePosition);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [updatePosition]);

  if (!show) return null;

  return (
    <div
      className="fixed z-[9999] flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1 transition-all duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <TooltipProvider>
        <div className="flex gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-muted' : ''}`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-gray-200 mx-0.5 self-center" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}`}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}`}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}`}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
} 