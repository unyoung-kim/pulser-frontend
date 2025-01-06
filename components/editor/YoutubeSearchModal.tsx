import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/core';
import YoutubeSearch from '../editor/YoutubeSearch';

interface YoutubeSearchModalProps {
  onSelect: (videoId: string) => void;
  onClose: () => void;
  editor: Editor;
}

export function YoutubeSearchModal({ onSelect, onClose, editor }: YoutubeSearchModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl rounded-lg bg-white">
        <YoutubeSearch onSelect={onSelect} onClose={onClose} editor={editor} />
      </div>
    </div>,
    document.body
  );
}
