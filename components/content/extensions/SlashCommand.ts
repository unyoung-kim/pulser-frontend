import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { CommandList } from '../CommandList';

interface CommandItem {
  title: string;
  command: (editor: any) => void;
}

export const SlashCommand = Extension.create({
  name: 'slash-command',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command(editor);
          editor.chain().focus().deleteRange(range).run();
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          const items = CommandList.commands || [];
          return items.filter((item: CommandItem) => 
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer | null;
          let popup: any[] = [];

          return {
            onStart: props => {
              component = new ReactRenderer(CommandList, {
                props: {
                  ...props,
                  editor: this.editor,
                  items: props.items,
                  command: props.command,
                },
                editor: this.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy('body', {
                getReferenceClientRect: () => props.clientRect?.(),
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },

            onUpdate(props) {
              if (component) {
                component.updateProps({
                  ...props,
                  items: props.items,
                  command: props.command,
                  editor: this.editor,
                });
              }

              if (!props.clientRect) {
                return;
              }

              popup[0]?.setProps({
                getReferenceClientRect: () => props.clientRect?.(),
              });
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0]?.hide();
                return true;
              }
              
              // Remove the onKeyDown call since we're not using keyboard navigation
              return false;
            },

            onExit() {
              popup[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
}); 