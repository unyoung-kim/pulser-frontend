import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Toolbar } from "@/components/ui/Toolbar";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { Check, Save } from "lucide-react";

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
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
          </Toolbar.Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showSaved && !hasChanges && !isSaving && (
          <span className="text-sm text-green-600 flex items-center">
            <Check className="w-4 h-4 mr-1" /> Saved
          </span>
        )}
        <Button
          className={
            hasChanges ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400"
          }
          size="sm"
          onClick={onSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <>
              <Save className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
