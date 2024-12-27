import { Extension } from '@tiptap/core';

export type ImageSearchEventProps = {
  type: 'imageSearch'
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageSearch: {
      setImageSearchModal: () => ReturnType
    };
  }

  interface EditorEvents {
    imageSearch: ImageSearchEventProps;
  }
}

export const ImageSearch = Extension.create({
  name: 'imageSearch',

  addCommands() {
    return {
      setImageSearchModal: () => ({ editor }) => {
        editor.emit('imageSearch', { type: 'imageSearch' } as ImageSearchEventProps);
        return true;
      },
    };
  },
});
