'use client';

import { memo } from 'react';
import { Editor as CoreEditor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { TableOfContentsStorage } from '@tiptap-pro/extension-table-of-contents';
import { cn } from '@/lib/utils';

export type TableOfContentsProps = {
  editor: CoreEditor;
  onItemClick?: () => void;
};

export const TableOfContents = memo(({ editor, onItemClick }: TableOfContentsProps) => {
  const content = useEditorState({
    editor,
    selector: (ctx) => (ctx.editor.storage.tableOfContents as TableOfContentsStorage).content,
  });

  const handleClick = (id: string) => {
    onItemClick?.();
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="mb-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        Table of contents
      </div>
      {content.length > 0 ? (
        <div className="flex flex-col gap-1">
          {content.map((item) => (
            <button
              key={item.id}
              type="button"
              style={{ marginLeft: `${1 * item.level - 1}rem` }}
              onClick={() => handleClick(item.id)}
              className={cn(
                'block font-medium text-left text-neutral-500 dark:text-neutral-300 p-1 rounded bg-opacity-10 text-sm hover:text-neutral-800 transition-all hover:bg-black hover:bg-opacity-5 truncate w-full cursor-pointer',
                'underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-200 dark:focus:ring-neutral-700',
                item.isActive &&
                  'text-neutral-800 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-900'
              )}
            >
              {item.itemIndex}. {item.textContent}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">Start adding headlines to your document …</div>
      )}
    </>
  );
});

TableOfContents.displayName = 'TableOfContents';
