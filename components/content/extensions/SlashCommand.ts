import { Editor, Extension, Range as TiptapRange } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import tippy, { Instance, Props } from 'tippy.js';
import { CommandList } from '../CommandList';

interface CommandItem {
  title: string;
  command: (editor: Editor) => void;
}

interface CommandProps {
  editor: Editor;
  range: TiptapRange;
  props: {
    command: (editor: Editor) => void;
  };
}

export const SlashCommand = Extension.create({
  name: 'slash-command',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: CommandProps) => {
          props.command(editor);
          editor.chain().focus().deleteRange(range).run();
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    
    return [
      Suggestion({
        editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          const items = CommandList.commands || [];
          return items.filter((item: CommandItem) => 
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer;
          let popup: Instance<Props>[] | null = null;

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(CommandList, {
                props: {
                  ...props,
                  editor,
                  items: props.items,
                  command: props.command,
                },
                editor,
              });

              if (!props.clientRect) {
                return;
              }

              const rect = props.clientRect();
              if (!rect) return;

              popup = [tippy(document.body, {
                getReferenceClientRect: () => rect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })];
            },

            onUpdate(props: SuggestionProps) {
              component?.updateProps({
                ...props,
                items: props.items,
                command: props.command,
                editor,
              });

              if (!props.clientRect) return;

              const rect = props.clientRect();
              if (!rect || !popup?.[0]) return;

              popup[0].setProps({
                getReferenceClientRect: () => rect,
              });
            },

            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === 'Escape') {
                popup?.[0]?.hide();
                return true;
              }
              return false;
            },

            onExit() {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
}); 