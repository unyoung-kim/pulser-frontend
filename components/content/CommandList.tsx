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
  Type
} from 'lucide-react';

interface CommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: Editor) => void;
}

interface CommandProps {
  editor: Editor;
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const commands: CommandItem[] = [
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
    icon: <Image className="w-12 h-12 p-2 border rounded bg-white shadow-sm" aria-label="Image icon" />,
    command: (editor: Editor) => {
      const url = window.prompt('Enter image URL');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
];

interface CommandListComponent
  extends React.ForwardRefExoticComponent<CommandProps & React.RefAttributes<HTMLDivElement>> {
  commands?: CommandItem[];
}

export const CommandList: CommandListComponent = forwardRef<HTMLDivElement, CommandProps>((props, ref) => {
  const { items = commands, command } = props;

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
CommandList.commands = commands;