// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Separator } from "@/components/ui/separator";
// import { Editor } from "@tiptap/react";
// import {
//   AlignCenter,
//   AlignLeft,
//   AlignRight,
//   Bold,
//   Check,
//   Heading1,
//   Heading2,
//   Heading3,
//   Image,
//   Italic,
//   Link,
//   List,
//   ListOrdered,
//   Redo,
//   Table,
//   Underline,
//   Undo,
// } from "lucide-react";
// import { useCallback } from "react";
// import LinkPanel from "../editor/LinkPanel";

// interface ToolbarProps {
//   editor: Editor;
//   isSaving?: boolean;
// }

// export function Toolbar({ editor, isSaving }: ToolbarProps) {
//   const addImage = useCallback(() => {
//     const url = window.prompt("Enter image URL");
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   }, [editor]);

//   const handleLinkSelect = useCallback(
//     (url: string) => {
//       if (url) {
//         editor
//           .chain()
//           .focus()
//           .extendMarkRange("link")
//           .setLink({ href: url })
//           .run();
//       }
//     },
//     [editor]
//   );

//   const addTableControls = useCallback(() => {
//     return (
//       <div className="flex items-center gap-1">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => editor.chain().focus().addColumnBefore().run()}
//           disabled={!editor.can().addColumnBefore()}
//         >
//           Add Column Before
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => editor.chain().focus().addColumnAfter().run()}
//           disabled={!editor.can().addColumnAfter()}
//         >
//           Add Column After
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => editor.chain().focus().deleteColumn().run()}
//           disabled={!editor.can().deleteColumn()}
//         >
//           Delete Column
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => editor.chain().focus().addRowBefore().run()}
//           disabled={!editor.can().addRowBefore()}
//         >
//           Add Row Before
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => editor.chain().focus().addRowAfter().run()}
//           disabled={!editor.can().addRowAfter()}
//         >
//           Add Row After
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => editor.chain().focus().deleteRow().run()}
//           disabled={!editor.can().deleteRow()}
//         >
//           Delete Row
//         </Button>
//       </div>
//     );
//   }, [editor]);

//   return (
//     <div className="border border-input bg-transparent rounded-md mb-4">
//       <div className="flex items-center justify-between px-2">
//         <div className="flex items-center flex-wrap">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             className={editor.isActive("bold") ? "bg-gray-200" : ""}
//           >
//             <Bold className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             className={editor.isActive("italic") ? "bg-gray-200" : ""}
//           >
//             <Italic className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleUnderline().run()}
//             className={editor.isActive("underline") ? "bg-gray-200" : ""}
//           >
//             <Underline className="h-4 w-4" />
//           </Button>

//           <Separator orientation="vertical" className="h-6" />

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().setTextAlign("left").run()}
//             className={
//               editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
//             }
//           >
//             <AlignLeft className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().setTextAlign("center").run()}
//             className={
//               editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
//             }
//           >
//             <AlignCenter className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().setTextAlign("right").run()}
//             className={
//               editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
//             }
//           >
//             <AlignRight className="h-4 w-4" />
//           </Button>

//           <Separator orientation="vertical" className="h-6" />

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 1 }).run()
//             }
//             className={
//               editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
//             }
//           >
//             <Heading1 className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 2 }).run()
//             }
//             className={
//               editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
//             }
//           >
//             <Heading2 className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 3 }).run()
//             }
//             className={
//               editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
//             }
//           >
//             <Heading3 className="h-4 w-4" />
//           </Button>

//           <Separator orientation="vertical" className="h-6" />

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//             className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
//           >
//             <List className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//             className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
//           >
//             <ListOrdered className="h-4 w-4" />
//           </Button>

//           <Separator orientation="vertical" className="h-6" />

//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={(e) => {
//                   // If text already has a link, remove it
//                   if (editor.isActive("link")) {
//                     e.preventDefault();
//                     editor.chain().focus().unsetLink().run();
//                     return;
//                   }
//                 }}
//               >
//                 <Link className="h-4 w-4" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-[520px] p-0">
//               <LinkPanel onSelect={handleLinkSelect} />
//             </PopoverContent>
//           </Popover>

//           <Button variant="ghost" size="sm" onClick={addImage}>
//             <Image className="h-4 w-4" aria-label="Image icon" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() =>
//               editor
//                 .chain()
//                 .focus()
//                 .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
//                 .run()
//             }
//           >
//             <Table className="h-4 w-4" />
//           </Button>

//           <Separator orientation="vertical" className="h-6" />

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().undo().run()}
//             disabled={!editor.can().undo()}
//           >
//             <Undo className="h-4 w-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => editor.chain().focus().redo().run()}
//             disabled={!editor.can().redo()}
//           >
//             <Redo className="h-4 w-4" />
//           </Button>
//         </div>

//         <div className="flex items-center px-2 py-1 text-sm text-muted-foreground">
//           {isSaving ? (
//             <span>Saving...</span>
//           ) : (
//             <div className="flex items-center gap-1">
//               <span>Saved</span>
//               <Check className="w-4 h-4 text-green-500" />
//             </div>
//           )}
//         </div>
//       </div>

//       {editor.isActive("table") && (
//         <div className="mt-2 pt-2 border-t">{addTableControls()}</div>
//       )}
//     </div>
//   );
// }
