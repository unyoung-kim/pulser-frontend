import { Editor, EditorContent } from "@tiptap/react";
import { useRef } from "react";

import "@/styles/index.css";

import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { useSidebar } from "@/hooks/useSidebar";
import { LinkMenu } from "../menus";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import { Sidebar } from "../Sidebar";
import { EditorHeader } from "./components/EditorHeader";

export const BlockEditor = ({
  aiToken,
  initialContent,
  editor,
  isSaving,
}: {
  aiToken?: string;
  initialContent: string;
  editor: Editor;
  isSaving: boolean;
}) => {
  const menuContainerRef = useRef(null);
  const leftSidebar = useSidebar();

  // const editor = useEditor({
  //   immediatelyRender: true,
  //   shouldRerenderOnTransaction: false,
  //   autofocus: true,
  //   onCreate: ({ editor }) => {
  //     if (editor.isEmpty) {
  //       editor.commands.setContent(initialContent);
  //       editor.commands.focus("start", { scrollIntoView: true });
  //     }
  //   },
  //   extensions: [
  //     ...ExtensionKit({ provider: null }),
  //     aiToken
  //       ? AiWriter.configure({
  //           authorId: undefined,
  //           authorName: undefined,
  //         })
  //       : undefined,
  //     aiToken
  //       ? AiImage.configure({
  //           authorId: undefined,
  //           authorName: undefined,
  //         })
  //       : undefined,
  //     aiToken ? Ai.configure({ token: aiToken }) : undefined,
  //   ].filter((e): e is AnyExtension => e !== undefined),
  //   editorProps: {
  //     attributes: {
  //       autocomplete: "off",
  //       autocorrect: "off",
  //       autocapitalize: "off",
  //       class: "min-h-full",
  //     },
  //   },
  //   content: initialContent,
  // });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader
          editor={editor}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
          isSaving={isSaving}
        />
        <EditorContent
          editor={editor}
          className="flex-1 overflow-y-auto h-full min-h-[calc(100vh-64px)]"
        />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
