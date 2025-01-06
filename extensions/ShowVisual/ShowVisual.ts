import { Extension } from '@tiptap/core';

// Define the event properties for the 'showVisual' event
export type ShowVisualEventProps = {
  type: 'showVisual';
  text?: string;
  savedSelection?: { from: number; to: number };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    showVisual: {
      // Command to set the visual modal with provided text
      setVisualModal: (text: string) => ReturnType;
      // Command to save the current selection
      setSavedSelection: (obj: { from: number; to: number }) => ReturnType;
    };
  }

  interface EditorEvents {
    showVisual: ShowVisualEventProps;
  }
}

export const ShowVisual = Extension.create({
  name: 'showVisual',
  // Add storage for the extension
  addStorage() {
    return {
      showVisualEvent: null as ShowVisualEventProps | null,
    };
  },
  addCommands() {
    return {
      // Command to open the visual modal with the provided text
      setVisualModal:
        (text: string) =>
        ({ editor }): boolean => {
          const event: ShowVisualEventProps = {
            type: 'showVisual',
            text,
          };
          // Update storage and emit the event
          editor.storage.showVisualEvent = event;
          editor.emit('showVisual', event);
          return true;
        },
      // Command to save the current selection in the editor
      setSavedSelection:
        (obj: { from: number; to: number }) =>
        ({ editor }): boolean => {
          // Update the saved selection if storage has the event
          if (editor.storage.showVisualEvent) {
            editor.storage.showVisualEvent.savedSelection = obj;
          }
          return true;
        },
    };
  },
});
