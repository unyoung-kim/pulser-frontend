import { Editor, EditorContent } from "@tiptap/react";
import { useEffect, useRef, useState, useCallback } from "react";

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
import { ImageSearchModal } from "@/components/editor/ImageSearchModal";
import { YoutubeSearchModal } from "@/components/editor/YoutubeSearchModal";
import { ImageSearchEventProps } from '@/extensions/ImageSearch/ImageSearch'
import { YoutubeSearchEventProps } from '@/extensions/YoutubeSearch/YoutubeSearch'

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
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [showYoutubeSearch, setShowYoutubeSearch] = useState(false);

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

  const handleImageSelect = useCallback((imageUrl: string) => {
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setShowImageSearch(false);
  }, [editor]);

  const handleYoutubeSelect = useCallback((videoId: string) => {
    editor.chain().focus().setYoutubeVideo({ src: videoId }).run();
    setShowYoutubeSearch(false);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleImageSearch = () => {
      setShowImageSearch(true);
    };

    const handleYoutubeSearch = () => {
      setShowYoutubeSearch(true);
    };

    editor.on('imageSearch', (_: ImageSearchEventProps) => handleImageSearch());
    editor.on('youtubeSearch', (_: YoutubeSearchEventProps) => handleYoutubeSearch());

    return () => {
      editor.off('imageSearch', handleImageSearch);
      editor.off('youtubeSearch', handleYoutubeSearch);
    };
  }, [editor]);

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
        {showImageSearch && (
          <ImageSearchModal
            onSelect={handleImageSelect}
            onClose={() => setShowImageSearch(false)}
          />
        )}
        {showYoutubeSearch && (
          <YoutubeSearchModal
            editor={editor}
            onSelect={handleYoutubeSelect}
            onClose={() => setShowYoutubeSearch(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BlockEditor;
