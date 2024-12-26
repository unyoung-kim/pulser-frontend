import React, { forwardRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Type,
  Youtube,
} from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { ImageSearchModal } from '../editor/ImageSearchModal';
import { VisualModal } from '../editor/VisualModal';
import { YoutubeSearchModal } from '../editor/YoutubeSearchModal';


interface CommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: Editor) => void;
}

interface CommandSection {
  title: string;
  items: CommandItem[];
}

interface CommandProps {
  editor: Editor;
  sections?: CommandSection[];
  command: (item: CommandItem) => void;
}

const commands: CommandSection[] = [
  {
    title: 'Basic Blocks',
    items: [
      {
        title: 'Text',
        description: 'Just start writing with plain text.',
        icon: (
          <Type className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm" />
        ),
        command: (editor: Editor) =>
          editor.chain().focus().setParagraph().run(),
      },
      {
        title: 'Heading 1',
        description: 'Large section heading.',
        icon: (
          <Heading1 className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm" />
        ),
        command: (editor: Editor) =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: (
          <Heading2 className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm" />
        ),
        command: (editor: Editor) =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: 'Heading 3',
        description: 'Small section heading.',
        icon: (
          <Heading3 className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm" />
        ),
        command: (editor: Editor) =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: 'Bullet List',
        description: 'Create a simple bullet list.',
        icon: (
          <List className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm" />
        ),
        command: (editor: Editor) =>
          editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: 'Numbered List',
        description: 'Create a numbered list.',
        icon: (
          <ListOrdered className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm" />
        ),
        command: (editor: Editor) =>
          editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: 'Table',
        description: 'Add a table to display data.',
        icon: (
          <Table className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm" />
        ),
        command: (editor: Editor) =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
      },
    ],
  },
  {
    title: 'Media',
    items: [
      {
        title: 'Image Search',
        description: 'Search and embed an image.',
        icon: (
          <svg
            className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              fill="#4285F4"
            />
          </svg>
        ),
        command: (editor: Editor) => {
          const modal = document.createElement('div');
          modal.setAttribute('id', 'image-search-modal');
          modal.style.display = 'block';
          document.body.appendChild(modal);

          const root = createRoot(modal);
          root.render(
            <ImageSearchModal
              onSelect={(imageUrl) => {
                editor.chain().focus().setImage({ src: imageUrl }).run();
                document.body.removeChild(modal);
                root.unmount();
              }}
              onClose={() => {
                document.body.removeChild(modal);
                root.unmount();
              }}
            />
          );
        },
      },
      {
        title: 'Video Search',
        description: 'Embed a Youtube video by searching for it.',
        icon: (
          <Youtube className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm text-[#FF0000]" />
        ),
        command: (editor: Editor) => {
          const modal = document.createElement('div');
          modal.setAttribute('id', 'youtube-search-modal');
          modal.style.display = 'block';
          document.body.appendChild(modal);

          console.log('Editor instance in command:', editor);

          const root = createRoot(modal);
          root.render(
            <YoutubeSearchModal
              editor={editor}
              onSelect={(videoId) => {
                console.log('Selected video:', videoId);
                editor.chain()
                  .focus()
                  .setYoutubeVideo({
                    src: videoId,
                    width: 640,
                    height: 480,
                  })
                  .run();
                document.body.removeChild(modal);
                root.unmount();
              }}
              onClose={() => {
                document.body.removeChild(modal);
                root.unmount();
              }}
            />
          );
        },
      },
      {
        title: 'Show Visuals',
        description: 'Show the visual modal.',
        icon: (
          <svg
            className="w-7 h-7 p-0.5 border rounded bg-white shadow-sm"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              fill="#4285F4"
            />
          </svg>
        ),
        command: (editor: Editor) => {
          const modal = document.createElement('div');
          modal.setAttribute('id', 'visual-modal');
          modal.style.display = 'block';
          document.body.appendChild(modal);

          const root = createRoot(modal);
          root.render(
            <VisualModal
              onSelect={(imageUrl) => {
                editor.chain().focus().setImage({ src: imageUrl }).run();
                document.body.removeChild(modal);
                root.unmount();
              }}
              onClose={() => {
                document.body.removeChild(modal);
                root.unmount();
              }}
              editor={new Editor()}
            />
          );
        },
      },
    ],
  },
];

interface CommandListComponent
  extends React.ForwardRefExoticComponent<
    CommandProps & React.RefAttributes<HTMLDivElement>
  > {
  sections?: CommandSection[];
}

export const CommandList: CommandListComponent = forwardRef<
  HTMLDivElement,
  CommandProps
>((props, ref) => {
  const { sections = commands, command } = props;

  return (
    <div
      ref={ref}
      className="relative bg-white rounded-lg shadow-lg border p-2 max-h-[240px] overflow-y-auto"
    >
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-2 last:mb-0">
          <div className="px-3 py-1.5 text-[11px] font-medium text-gray-500 uppercase">
            {section.title}
          </div>
          {section.items.map((item, index) => (
            <button
              key={index}
              onClick={() => command(item)}
              className="w-full px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <div className="flex flex-col">
                  <span className="font-medium text-sm leading-tight">
                    {item.title}
                  </span>
                  <span className="text-xs leading-tight text-gray-500">
                    {item.description}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
});

CommandList.displayName = 'CommandList';
CommandList.sections = commands;
