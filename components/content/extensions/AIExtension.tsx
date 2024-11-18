import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const AIExtension = Extension.create({
  name: 'ai',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('ai'),
        props: {
          decorations: (state) => {
            const { selection } = state;
            if (!selection.empty) {
              return DecorationSet.create(state.doc, [
                Decoration.inline(selection.from, selection.to, {
                  class: 'ai-selection'
                })
              ]);
            }
            return DecorationSet.empty;
          },
        },
      })
    ];
  },

  addCommands() {
    return {
      triggerAI: () => ({ commands }) => {
        // Will be implemented with the AI menu
        return true;
      },
    };
  },
}); 