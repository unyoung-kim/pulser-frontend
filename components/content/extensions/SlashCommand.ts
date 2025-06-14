import { Editor, Extension, Range as TiptapRange } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import tippy, { Instance, Props } from 'tippy.js';
import { CommandList } from '../CommandList';

// interface CommandItem {
//   title: string;
//   description: string;
//   command: (editor: Editor) => void;
// }

// interface CommandSection {
//   title: string;
//   items: CommandItem[];
// }

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
          const sections = CommandList.sections || [];
          if (!query) {
            return sections.flatMap((section) => section.items);
          }
          return sections.flatMap((section) =>
            section.items.filter(
              (item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            )
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
                  sections: props.query
                    ? [
                        {
                          title: 'Matching Commands',
                          items: props.items,
                        },
                      ]
                    : CommandList.sections,
                  command: props.command,
                  filterQuery: props.query,
                },
                editor,
              });

              if (!props.clientRect) {
                return;
              }

              const rect = props.clientRect();
              if (!rect) return;

              popup = [
                tippy(document.body, {
                  getReferenceClientRect: () => rect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                }),
              ];
            },

            onUpdate(props: SuggestionProps) {
              component?.updateProps({
                ...props,
                sections: props.query
                  ? [
                      {
                        title: 'Matching Commands',
                        items: props.items,
                      },
                    ]
                  : CommandList.sections,
                command: props.command,
                editor,
                filterQuery: props.query,
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
