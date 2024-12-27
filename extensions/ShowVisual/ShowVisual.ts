import { Extension } from '@tiptap/core';

export type ShowVisualEventProps = {
  type: 'showVisual';
  text?: string;
  savedSelection?: { from: number; to: number };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    showvisual: {
      setVisualModal: (text: string) => ReturnType;
      setSavedSelection: (obj: { from: number; to: number }) => ReturnType;
    };
  }

  interface EditorEvents {
    showVisual: ShowVisualEventProps;
  }
}

export const ShowVisual = Extension.create({
  name: 'showVisual',
  addStorage(): { showVisualEvent: ShowVisualEventProps | null } {
    return {
      showVisualEvent: null,
    };
  },
  addCommands() {
    return {
      setVisualModal:
        (text: string) =>
          ({ editor }): boolean => {
            const event: ShowVisualEventProps = {
              type: 'showVisual',
              text,
            };
            editor.storage.showVisualEvent = event;
            editor.emit('showVisual', event);
            return true;
          },
      setSavedSelection:
        (obj: { from: number; to: number }) =>
          ({ editor }): boolean => {
            if (editor.storage.showVisualEvent) {
              editor.storage.showVisualEvent.savedSelection = obj;
            }
            return true;
          },
    };
  }
});
