import { Editor, EditorContent } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

import "@/styles/index.css";

import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useSidebar } from "@/hooks/useSidebar";
import { LinkMenu } from "../menus";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import { Sidebar } from "../Sidebar";
import { EditorHeader } from "./components/EditorHeader";

export const BlockEditor = ({
  aiToken,
  initialContent,
  editor,
  isSaving,
  onSave,
}: {
  aiToken?: string;
  initialContent: string;
  editor: Editor;
  isSaving: boolean;
  onSave: () => void;
}) => {
  const menuContainerRef = useRef(null);
  const leftSidebar = useSidebar();
  const [lastSavedContent, setLastSavedContent] = useState(editor.getHTML());
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const checkChanges = () => {
      const currentContent = editor.getHTML();
      setHasChanges(currentContent !== lastSavedContent);
      setShowSaved(false);
    };

    editor.on("update", checkChanges);
    return () => {
      editor.off("update", checkChanges);
    };
  }, [editor, lastSavedContent]);

  const handleSave = () => {
    onSave();
    setLastSavedContent(editor.getHTML());
    setHasChanges(false);
    setShowSaved(true);

    // Optionally hide the "Saved" indicator after a few seconds
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader
          editor={editor}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
          isSaving={isSaving}
          onSave={handleSave}
          hasChanges={hasChanges}
          showSaved={showSaved}
        />
        <EditorContent
          editor={editor}
          className="flex-1 overflow-y-auto h-full min-h-[calc(100vh-64px)]"
        />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
