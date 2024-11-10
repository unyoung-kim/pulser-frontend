import { createPortal } from "react-dom";
import YoutubeSearch from "../editor/YoutubeSearch";

interface YoutubeSearchModalProps {
  onSelect: (videoId: string) => void;
  onClose: () => void;
}

export function YoutubeSearchModal({
  onSelect,
  onClose,
}: YoutubeSearchModalProps) {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-3xl mx-4">
        <YoutubeSearch onSelect={onSelect} onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}
