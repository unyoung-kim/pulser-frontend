import { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/Icon';
import { Toolbar } from '@/components/ui/Toolbar';

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  editor: Editor;
  isSaving: boolean;
  onSave?: () => void;
  hasChanges: boolean;
  showSaved?: boolean;
};

export const EditorHeader = ({
  editor,
  isSidebarOpen,
  toggleSidebar,
  isSaving,
  onSave,
  hasChanges,
  showSaved,
}: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
  });

  return (
    <div className="flex flex-none flex-row items-center justify-between border-b border-neutral-200 bg-white py-2 pl-6 pr-3 text-black dark:border-neutral-800 dark:bg-black dark:text-white">
      <div className="flex flex-row items-center gap-x-1.5">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? 'bg-transparent' : ''}
          >
            <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeft'} />
          </Toolbar.Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showSaved && !hasChanges && !isSaving && (
          <span className="flex items-center text-sm text-green-600">
            <Check className="mr-1 h-4 w-4" /> Saved
          </span>
        )}
        <Button
          className={hasChanges ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400'}
          size="sm"
          onClick={onSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
