"use client";

import "@/app/content/editor.css";
import { AiImage, AiWriter } from "@/extensions";
import { Ai } from "@/extensions/Ai";
import ExtensionKit from "@/extensions/extension-kit";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { supabase } from "@/lib/supabaseClient";
import { getJwtToken } from "@/lib/token";
import { useQuery } from "@tanstack/react-query";
import { AnyExtension, useEditor } from "@tiptap/react";
import React, { useCallback, useState } from "react";
import { BlockEditor } from "../new-editor/BlockEditor";
import { EditorSidebar } from "./EditorSidebar";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ContentEditorProps {
  initialContent: string;
  contentId: string;
  projectId: string;
  title: string;
  status: "drafted" | "scheduled" | "published" | "archived";
  mainKeyword?: string;
  keywords?: string[];
}

export function ContentEditor({
  initialContent,
  contentId,
  projectId,
  title,
  status,
  keywords = [],
}: ContentEditorProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<
    "drafted" | "scheduled" | "published" | "archived"
  >(status);
  const [currentTitle, setCurrentTitle] = useState<string>(title);
  const { toast } = useToast();

  const aiToken = getJwtToken(
    process.env.NEXT_PUBLIC_TIPTAP_AI_JWT_SECRET ?? ""
  );

  const saveContent = useDebounceCallback(
    async (content: string) => {
      if (!contentId || !projectId) return;

      try {
        const { error: contentError } = await supabase
          .from("Content")
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq("id", contentId);

        if (contentError) throw contentError;

        const { error: bodyError } = await supabase.from("ContentBody").upsert({
          content_id: contentId,
          body: content,
          updated_at: new Date().toISOString(),
        });

        if (bodyError) throw bodyError;
      } catch (error) {
        console.error("Error saving content:", error);
        toast({
          title: "Error",
          description: "Failed to save content",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    },
    2500,
    { onStart: () => setIsSaving(true) }
  );

  // const editor = useEditor({
  //   extensions: [
  //     StarterKit.configure({
  //       heading: {
  //         levels: [1, 2, 3],
  //       },
  //     }),
  //     BulletList,
  //     OrderedList,
  //     Image,
  //     Link.configure({
  //       openOnClick: true,
  //       HTMLAttributes: {
  //         target: "_blank",
  //         rel: "noopener noreferrer",
  //       },
  //     }),
  //     Table.configure({
  //       resizable: true,
  //       HTMLAttributes: {
  //         class: "tableWrapper",
  //       },
  //     }),
  //     TableRow.configure({
  //       HTMLAttributes: {
  //         class: "tableRow",
  //       },
  //     }),
  //     TableCell.configure({
  //       HTMLAttributes: {
  //         class: "tableCell",
  //       },
  //     }),
  //     TableHeader.configure({
  //       HTMLAttributes: {
  //         class: "tableHeader",
  //       },
  //     }),
  //     Underline,
  //     TextAlign.configure({
  //       types: ["heading", "paragraph"],
  //     }),
  //     SlashCommand,
  //     Youtube.configure({
  //       controls: false,
  //       nocookie: true,
  //     }),
  //   ],
  //   content: initialContent,
  //   editorProps: {
  //     attributes: {
  //       class: "prose prose-lg max-w-full focus:outline-none",
  //     },
  //   },
  //   onUpdate: ({ editor }) => {
  //     const html = editor.getHTML();
  //     saveContent(html);
  //   },
  // });

  const editor2 = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent(initialContent);
        editor.commands.focus("start", { scrollIntoView: true });
      }
    },
    extensions: [
      ...ExtensionKit({ provider: null }),
      aiToken
        ? AiWriter.configure({
            appId: "y9djg7p9",
            token: aiToken,
            authorId: undefined,
            authorName: undefined,
          })
        : undefined,
      aiToken
        ? AiImage.configure({
            appId: "y9djg7p9",
            token: aiToken,
            authorId: undefined,
            authorName: undefined,
          })
        : undefined,
      aiToken ? Ai.configure({ appId: "y9djg7p9", token: aiToken }) : undefined,
    ].filter((e): e is AnyExtension => e !== undefined),
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: "min-h-full",
      },
    },
    // content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      saveContent(html);
    },
  });

  useQuery({
    queryKey: ["contentBody", contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ContentBody")
        .select("body")
        .eq("content_id", contentId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      return data?.body;
    },
    enabled: !!contentId && !!editor2,
    onSuccess: (data) => {
      if (data && editor2) {
        editor2.commands.setContent(data);

        if (editor2.getHTML()) {
          saveContent(editor2.getHTML());
        }
      }
    },
    onError: (error) => {
      console.error("Error fetching body content:", error);
      toast({
        title: "Error",
        description: "Failed to load content body",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(
      newStatus as "drafted" | "scheduled" | "published" | "archived"
    );
  };

  const saveTitle = useDebounceCallback(
    async (newTitle: string) => {
      if (!contentId || !projectId) return;

      try {
        const { error } = await supabase
          .from("Content")
          .update({
            title: newTitle,
            updated_at: new Date().toISOString(),
          })
          .eq("id", contentId);

        if (error) throw error;
      } catch (error) {
        console.error("Error saving title:", error);
        toast({
          title: "Error",
          description: "Failed to save title",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    },
    1000,
    { onStart: () => setIsSaving(true) }
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setCurrentTitle(newTitle);
      saveTitle(newTitle);
    },
    [saveTitle]
  );

  return (
    <div className="flex w-full max-w-screen-2xl mx-auto relative">
      <div className="flex-1 max-w-none">
        <div className="mb-4">
          <input
            type="text"
            value={currentTitle}
            onChange={handleTitleChange}
            className="text-3xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
            placeholder="Enter title..."
          />
        </div>

        {/* {editor2 && <Toolbar editor={editor2} isSaving={isSaving} />} */}

        <div className="prose-container bg-white rounded-lg shadow-lg border border-gray-200 p-8 min-h-[500px] px-12">
          {/* <EditorContent editor={editor} /> */}
          <BlockEditor
            aiToken={aiToken ?? undefined}
            initialContent={initialContent}
            editor={editor2}
            isSaving={isSaving}
          />
        </div>
      </div>

      {editor2 && (
        <div className="fixed top-0 right-0 h-screen">
          <EditorSidebar
            editor={editor2}
            status={currentStatus}
            keywords={keywords}
            contentId={contentId}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
}
