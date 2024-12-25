import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/core';
import YoutubeSearch from '../editor/YoutubeSearch';


interface YoutubeSearchModalProps {
  onSelect: (videoId: string) => void;
  onClose: () => void;
  editor: Editor;
}

export function YoutubeSearchModal({
  onSelect,
  onClose,
  editor,
}: YoutubeSearchModalProps) {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh]">
        <YoutubeSearch onSelect={onSelect} onClose={onClose} editor={editor} />
      </div>
    </div>,
    document.body
  );
}
