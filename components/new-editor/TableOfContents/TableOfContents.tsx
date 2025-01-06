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
                'block w-full cursor-pointer truncate rounded bg-opacity-10 p-1 text-left text-sm font-medium text-neutral-500 transition-all hover:bg-black hover:bg-opacity-5 hover:text-neutral-800 dark:text-neutral-300',
                'underline focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:ring-offset-1 dark:focus:ring-neutral-700',
                item.isActive &&
                  'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100'
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
