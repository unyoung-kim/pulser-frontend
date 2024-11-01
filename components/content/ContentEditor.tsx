'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import { useCallback, useEffect, useState } from 'react';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import { createClient } from '@supabase/supabase-js';
import { Toolbar } from './Toolbar';
import { useToast } from '@/hooks/use-toast';
import { SlashCommand } from './extensions/SlashCommand';
import '@/app/content/editor.css';
import { EditorSidebar } from './EditorSidebar';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ContentEditorProps {
  initialContent: string;
  contentId: string;
  projectId: string;
  title: string;
  status: 'drafted' | 'scheduled' | 'published' | 'archived';
  mainKeyword?: string;
}

export function ContentEditor({ 
  initialContent, 
  contentId, 
  projectId, 
  title,
  status,
  mainKeyword 
}: ContentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      BulletList,
      OrderedList,
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tableWrapper',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'tableRow',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'tableCell',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'tableHeader',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      SlashCommand,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-full focus:outline-none',
      },
    },
  });

  const saveContent = useDebounceCallback(async (content: string) => {
    if (!contentId || !projectId) return;

    setIsSaving(true);
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase
        .from('Content')
        .update({ 
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving content:', error);
      
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  useEffect(() => {
    if (editor?.getHTML()) {
      saveContent(editor.getHTML());
    }
  }, [editor?.getHTML()]);

  return (
    <div className="flex w-full max-w-screen-2xl mx-auto relative">
      <div className="flex-1 max-w-screen-lg pr-60">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        
        {editor && <Toolbar editor={editor} isSaving={isSaving} />}
        
        <div className="prose-container bg-white rounded-lg shadow-sm p-8 min-h-[500px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {editor && (
        <div className="fixed top-0 right-0 h-screen">
          <EditorSidebar 
            editor={editor}
            status={status}
            mainKeyword={mainKeyword}
          />
        </div>
      )}
    </div>
  );
} 