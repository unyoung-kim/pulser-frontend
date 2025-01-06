"use client";

import "@/app/content/editor.css";
import { AiImage, AiWriter } from "@/extensions";
import { Ai } from "@/extensions/Ai";
import ExtensionKit from "@/extensions/extension-kit";
import { ImageSearch } from "@/extensions/ImageSearch/ImageSearch";
import { ShowVisual } from "@/extensions/ShowVisual/ShowVisual";
import { YoutubeExtension } from "@/extensions/YoutubeExtension";
import { YoutubeSearch } from "@/extensions/YoutubeSearch/YoutubeSearch";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { supabase } from "@/lib/supabaseClient";
import { getJwtToken } from "@/lib/token";
import { useQuery } from "@tanstack/react-query";
import { CharacterCount } from "@tiptap/extension-character-count";
import { AnyExtension, useEditor } from "@tiptap/react";
import React, { useCallback, useEffect, useState } from "react";
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
  keyword?: string;
  type: string;
}

export function ContentEditor({
  initialContent,
  contentId,
  projectId,
  title,
  status,
  keyword,
  type,
}: ContentEditorProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<
    "drafted" | "scheduled" | "published" | "archived"
  >(status);
  const [currentTitle, setCurrentTitle] = useState<string>(title);
  const { toast } = useToast();
  const [internalLinkCount, setInternalLinkCount] = useState<number>(0);

  const aiToken = getJwtToken(process.env.NEXT_PUBLIC_TIPTAP_AI_JWT_SECRET ?? "");

  // const saveContent = useDebounceCallback(
  //   async (content: string) => {
  //     // if (!contentId || !projectId) return;
  //     // try {
  //     //   const { error: contentError } = await supabase
  //     //     .from("Content")
  //     //     .update({
  //     //       updated_at: new Date().toISOString(),
  //     //     })
  //     //     .eq("id", contentId);
  //     //   if (contentError) throw contentError;
  //     //   const { error: bodyError } = await supabase.from("ContentBody").upsert({
  //     //     content_id: contentId,
  //     //     body: content,
  //     //     updated_at: new Date().toISOString(),
  //     //   });
  //     //   if (bodyError) throw bodyError;
  //     // } catch (error) {
  //     //   console.error("Error saving content:", error);
  //     //   toast({
  //     //     title: "Error",
  //     //     description: "Failed to save content",
  //     //     variant: "destructive",
  //     //   });
  //     // } finally {
  //     //   setIsSaving(false);
  //     // }
  //   },
  //   2500,
  //   { onStart: () => setIsSaving(true) }
  // );

  const saveContent = async (content: string) => {
    if (!contentId || !projectId) return;
    try {
      // Update Content table
      const { error: contentError } = await supabase
        .from("Content")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", contentId);
      if (contentError) {
        console.error("Error updating Content table:", contentError);
        throw new Error(`Content table update failed: ${contentError.message}`);
      }

      // Update ContentBody table with proper upsert configuration
      const { error: bodyError } = await supabase.from("ContentBody").upsert(
        {
          content_id: contentId,
          body: content,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "content_id", // Specify the column to check for conflicts
        },
      );
      if (bodyError) {
        console.error("Error updating ContentBody table:", bodyError);
        throw new Error(`ContentBody table update failed: ${bodyError.message}`);
      }
    } catch (error) {
      console.error("Error saving content:", {
        error,
        contentId,
        contentLength: content.length,
        timestamp: new Date().toISOString(),
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
      CharacterCount,
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
      ImageSearch,
      ShowVisual,
      YoutubeSearch,
      YoutubeExtension,
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
      // saveContent(html);
    },
  });

  const contentBodyQuery = useQuery({
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
    refetchOnWindowFocus: false,
  });

  const internalLinkCountQuery = useQuery({
    queryKey: ["internalLinkCount", contentId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contentinternallink")
        .select("*", { count: "exact", head: true })
        .eq("content_id", contentId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!contentId,
  });

  React.useEffect(() => {
    if (contentBodyQuery.isSuccess && contentBodyQuery.data && editor2) {
      editor2.commands.setContent(contentBodyQuery.data);
    }
  }, [contentBodyQuery.isSuccess, contentBodyQuery.data, editor2]);

  React.useEffect(() => {
    if (contentBodyQuery.isError && contentBodyQuery.error) {
      console.error("Error fetching body content:", contentBodyQuery.error);
      toast({
        title: "Error",
        description: "Failed to load content body",
        variant: "destructive",
      });
    }
  }, [contentBodyQuery.isError, contentBodyQuery.error, toast]);

  React.useEffect(() => {
    if (internalLinkCountQuery.isSuccess) {
      console.log("Internal link count:", internalLinkCountQuery.data);
      setInternalLinkCount(internalLinkCountQuery.data);
    }
  }, [internalLinkCountQuery.isSuccess, internalLinkCountQuery.data]);

  React.useEffect(() => {
    if (internalLinkCountQuery.isError && internalLinkCountQuery.error) {
      console.error("Error fetching internal link count:", internalLinkCountQuery.error);
      toast({
        title: "Error",
        description: "Failed to load internal links",
        variant: "destructive",
      });
    }
  }, [internalLinkCountQuery.isError, internalLinkCountQuery.error, toast]);

  useEffect(() => {
    return () => {
      editor2?.destroy();
    };
  }, [editor2]);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as "drafted" | "scheduled" | "published" | "archived");
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
    { onStart: () => setIsSaving(true) },
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setCurrentTitle(newTitle);
      saveTitle(newTitle);
    },
    [saveTitle],
  );

  return (
    <div className="flex w-full max-w-screen-2xl mx-auto relative">
      <div className="flex-1 max-w-none">
        {/* <div className="mb-4">
          <input
            type="text"
            value={currentTitle}
            onChange={handleTitleChange}
            className="text-3xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
            placeholder="Enter title..."
          />
        </div> */}

        {/* {editor2 && <Toolbar editor={editor2} isSaving={isSaving} />} */}

        <div className="prose-container bg-white rounded-lg shadow-lg border border-gray-200 p-8 min-h-[500px] px-12">
          {/* <EditorContent editor={editor} /> */}
          <BlockEditor
            aiToken={aiToken ?? undefined}
            initialContent={initialContent}
            editor={editor2}
            isSaving={isSaving}
            onSave={() => saveContent(editor2.getHTML())}
          />
        </div>
      </div>

      {editor2 && (
        <div className="fixed top-0 right-0 h-screen">
          <EditorSidebar
            editor={editor2}
            status={currentStatus}
            type={type}
            keyword={keyword}
            contentId={contentId}
            onStatusChange={handleStatusChange}
            internalLinkCount={internalLinkCount}
          />
        </div>
      )}
    </div>
  );
}
