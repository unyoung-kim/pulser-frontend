import React, { forwardRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Image,
  Quote,
  Code,
  Type
} from 'lucide-react';

interface CommandProps {
  editor: Editor;
  items: typeof commands;
  command: (command: any) => void;
}

const commands = [
  {
    title: 'Text',
    description: 'Just start writing with plain text.',
    icon: <Type className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Large section heading.',
    icon: <Heading1 className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    icon: <Heading2 className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    icon: <Heading3 className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    icon: <List className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list.',
    icon: <ListOrdered className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Table',
    description: 'Add a table to display data.',
    icon: <Table className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => 
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Image',
    description: 'Upload or embed an image.',
    icon: <Image className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => {
      const url = window.prompt('Enter image URL');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quotation.',
    icon: <Quote className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Display code with syntax highlighting.',
    icon: <Code className="w-12 h-12 p-2 border rounded bg-white shadow-sm" />,
    command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
];

export const CommandList = forwardRef<HTMLDivElement, CommandProps>((props, ref) => {
  const { items = commands, command, editor } = props;

  return (
    <div 
      ref={ref} 
      className="relative bg-white rounded-lg shadow-lg border p-2 max-h-[330px] overflow-y-auto"
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => command(item)}
          className="w-full px-2 py-3 rounded-lg hover:bg-gray-100 cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <div className="flex flex-col">
              <span className="font-medium">{item.title}</span>
              <span className="text-sm text-gray-500">{item.description}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
});

CommandList.displayName = 'CommandList';
// Export commands for filtering in SlashCommand extension
CommandList.commands = commands;