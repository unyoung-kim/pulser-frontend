import { useEffect, useRef, useState, useCallback } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { ImageSearchModal } from '@/components/editor/ImageSearchModal';
import { VisualModal } from '@/components/editor/VisualModal';
import { YoutubeSearchModal } from '@/components/editor/YoutubeSearchModal';
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu';
import { ImageSearchEventProps } from '@/extensions/ImageSearch/ImageSearch';
import { ColumnsMenu } from '@/extensions/MultiColumn/menus';
import { ShowVisualEventProps } from '@/extensions/ShowVisual/ShowVisual';
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus';
import { YoutubeSearchEventProps } from '@/extensions/YoutubeSearch/YoutubeSearch';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { LinkMenu } from '../menus';
import { ContentItemMenu } from '../menus/ContentItemMenu';
import { TextMenu } from '../menus/TextMenu';
import { Sidebar } from '../Sidebar';
import { AiPromptInput } from './components/AiPromptInput';
import { EditorHeader } from './components/EditorHeader';
import '@/styles/index.css';

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
  const [showVisualModal, setShowVisualModal] = useState(false);

  // Debounced save function
  const debouncedSave = useDebounceCallback(() => {
    onSave();
    setLastSavedContent(editor.getHTML());
    setHasChanges(false);
    setShowSaved(true);

    // Hide the "Saved" indicator after 3 seconds
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);
  }, 3000);

  // Track content changes and trigger auto-save
  useEffect(() => {
    const handleUpdate = () => {
      const currentContent = editor.getHTML();
      const isContentChanged = currentContent !== lastSavedContent;
      if (isContentChanged) {
        setHasChanges(isContentChanged);
        debouncedSave();
      }
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, lastSavedContent, debouncedSave]);

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

  const handleImageSelect = useCallback(
    (imageUrl: string) => {
      editor.commands.setImageBlock({ src: imageUrl });
      setShowImageSearch(false);
    },
    [editor]
  );

  const handleYoutubeSelect = useCallback(
    (videoId: string) => {
      editor.chain().focus().setYoutubeVideo({ src: videoId }).run();
      setShowYoutubeSearch(false);
    },
    [editor]
  );

  useEffect(() => {
    if (!editor) return;

    const handleImageSearch = () => {
      setShowImageSearch(true);
    };

    const handleYoutubeSearch = () => {
      setShowYoutubeSearch(true);
    };

    const handleVisualSelect = () => {
      setShowVisualModal(true);
    };

    editor.on('imageSearch', (_: ImageSearchEventProps) => handleImageSearch());
    editor.on('youtubeSearch', (_: YoutubeSearchEventProps) => handleYoutubeSearch());
    editor.on('showVisual', (_: ShowVisualEventProps) => handleVisualSelect());

    return () => {
      editor.off('imageSearch', handleImageSearch);
      editor.off('youtubeSearch', handleYoutubeSearch);
      editor.off('showVisual', handleVisualSelect);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
      <div className="relative flex h-full flex-1 flex-col">
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
          className={cn('h-full min-h-[calc(100vh-64px)] flex-1', leftSidebar.isOpen && 'lg:ml-20')}
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
        {showVisualModal && (
          <VisualModal
            editor={editor}
            onClose={() => {
              setShowVisualModal(false);
              // setTimeout(() => {
              //   if (document.body.style.pointerEvents === 'none') {
              //     document.body.style.pointerEvents = '';
              //   }
              // }, 50);
            }}
          />
        )}
        <AiPromptInput editor={editor} />
      </div>
    </div>
  );
};

export default BlockEditor;
