"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";

import {
  BlockquoteFigure,
  CharacterCount,
  CodeBlock,
  Color,
  Column,
  Columns,
  Details,
  DetailsContent,
  DetailsSummary,
  Document,
  Dropcursor,
  Emoji,
  emojiSuggestion,
  Figcaption,
  FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableOfContents,
  TableRow,
  TaskItem,
  TaskList,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  UniqueID,
} from ".";

import API from "@/lib/editor/api";
import { isChangeOrigin } from "@tiptap/extension-collaboration";
import { Image } from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { ImageUpload } from "./ImageUpload";
import { TableOfContentsNode } from "./TableOfContentsNode";

interface ExtensionKitProps {
  provider?: HocuspocusProvider | null;
}

export const ExtensionKit = ({ provider }: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  UniqueID.configure({
    types: ["paragraph", "heading", "blockquote", "codeBlock", "table"],
    filterTransaction: (transaction) => !isChangeOrigin(transaction),
  }),
  StarterKit.configure({
    // document: false,
    // dropcursor: false,
    // heading: false,
    // horizontalRule: false,
    // blockquote: false,
    // history: false,
    // codeBlock: false,
  }),
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: "details",
    },
  }),
  DetailsContent,
  DetailsSummary,
  CodeBlock,
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  TableOfContents,
  TableOfContentsNode,
  ImageUpload.configure({
    clientId: provider?.document?.clientID,
  }),
  ImageBlock,
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Youtube.configure({
    controls: false,
    nocookie: true,
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (currentEditor, files, pos) => {
      files.forEach(async (file) => {
        const url = await API.uploadImage(file);

        currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run();
      });
    },
    onPaste: (currentEditor, files) => {
      files.forEach(async (file) => {
        const url = await API.uploadImage(file);

        return currentEditor
          .chain()
          .setImageBlockAt({
            pos: currentEditor.state.selection.anchor,
            src: url,
          })
          .focus()
          .run();
      });
    },
  }),
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {};
    },
  }).configure({
    types: ["heading", "paragraph"],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => "",
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: "ProseMirror-dropcursor border-black",
  }),
];

export default ExtensionKit;
