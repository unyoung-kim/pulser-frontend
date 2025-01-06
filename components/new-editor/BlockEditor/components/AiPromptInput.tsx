"use client";

import { useTextmenuCommands } from "@/components/new-editor/menus/TextMenu/hooks/useTextmenuCommands";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Tooltip from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiStorage } from "@tiptap-pro/extension-ai";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt must be at least 1 character.",
  }),
});

interface AiPromptInputProps {
  editor: Editor;
}

const HUMANIZE_PROMPT = `You will be given a user query. Please generate text that avoids using formal
or overly academic phrases such as 'it is worth noting,' 'furthermore,' 'consequently,' 'in terms of,' 'one may argue,'
'it is imperative,' 'this suggests that,' 'thus,' 'it is evident that,' 'notwithstanding,' 'pertaining to,'
'therein lies,' 'utilize,' 'be advised,' 'hence,' 'indicate,' 'facilitate,' 'subsequently,' 'moreover,' and
'it can be seen that.' Aim for a natural, conversational style that sounds like two friends talking at
the coffee shop. Use direct, simple language and choose phrases that are commonly used in everyday speech.
If a formal phrase is absolutely necessary for clarity or accuracy, you may include it, but otherwise,
please prioritize making the text engaging, clear, and relatable. If selected paragraph contains links,
please preserve the links in the generated text.
Instruction: `;

// utility function to check if the text is a heading
const isHeading = (text: string | string[]): boolean => {
  return text.length <= 60 && !text.includes(".");
};

export function AiPromptInput({ editor }: AiPromptInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { onVisualSelection } = useTextmenuCommands(editor);
  const [selectedText, setSelectedText] = useState("");

  // Get the generated text and loading state from the editor
  const { isLoading, generatedText, error, isTextSelected } = useEditorState({
    editor,
    selector: (ctx) => {
      const aiStorage = ctx.editor.storage.ai as AiStorage;

      const { from, to } = ctx.editor.state.selection;
      const isTextSelected = from !== to;

      return {
        isLoading: aiStorage.state === "loading",
        generatedText: aiStorage.response,
        error: aiStorage.error,
        isTextSelected,
      };
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // Handle form submission
  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const { from, to } = editor.state.selection;
      const selectedNode = editor.state.doc.cut(from, to).toJSON();
      const selectedHTML = generateHTML(selectedNode, editor.extensionManager.extensions);

      const textToInsert = selectedHTML ? `${values.prompt}: ${selectedHTML}` : values.prompt;

      editor
        .chain()
        .focus()
        .aiTextPrompt({
          stream: true,
          format: "rich-text",
          text: textToInsert,
          insert: false,
        })
        .run();

      form.reset();
      setIsVisible(true);
    },
    [editor, form],
  );

  // Handle humanize button click
  const handleHumanize = useCallback(() => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (selectedText.length === 0) {
      toast({ description: "Select Text first", variant: "destructive" });
      return;
    }

    const instruction = isHeading(selectedText)
      ? "Humanize this heading to make it clear and conversational: "
      : "Humanize this paragraph to make it friendly and relatable: ";

    const finalPrompt = HUMANIZE_PROMPT + instruction;

    form.setValue("prompt", finalPrompt);
    form.handleSubmit(onSubmit)();
  }, [editor, form, onSubmit]);

  // Accept the generated text
  const accept = useCallback(() => {
    editor
      .chain()
      .focus()
      .deleteRange({
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      })
      .run();
    editor.chain().focus().aiAccept().run();
    setIsVisible(false);
  }, [editor]);

  // Reject the generated text
  const reject = useCallback(() => {
    editor.chain().focus().aiReject().run();
    setIsVisible(false);
  }, [editor]);

  // Regenerate the text
  const regenerate = useCallback(() => {
    editor.chain().focus().aiRegenerate().run();
  }, [editor]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [error]);

  // Update selectedText whenever selection changes
  useEffect(() => {
    const updateSelection = () => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setSelectedText(text);
    };

    // Initial selection
    updateSelection();

    // Add selection change listener
    editor.on("selectionUpdate", updateSelection);

    return () => {
      editor.off("selectionUpdate", updateSelection);
    };
  }, [editor]);

  return (
    <div className="fixed left-32 right-[420px] bottom-3 z-[9999] p-4">
      <div className="max-w-xl mx-auto flex flex-col gap-3">
        {/* AI Response Panel */}
        <div
          className={cn(
            "mb-4 overflow-hidden rounded-lg bg-white p-4",
            "ring-2 ring-indigo-500/50",
            "shadow-[0_0_25px_rgba(99,102,241,0.4)]",
            isVisible ? "block" : "hidden",
          )}
        >
          {/* Add the selection badge */}

          <div className="prose prose-sm max-h-[14rem] overflow-y-auto">
            {isLoading ? (
              <div className="overflow-hidden w-full">
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: generatedText || "" }} />
            )}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={reject}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={accept}
              disabled={!generatedText}
              className="text-primary hover:bg-primary/10"
            >
              <Check className="mr-2 h-4 w-4" />
              Accept
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={regenerate}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            isVisible && generatedText && "hidden",
          )}
        >
          <Tooltip
            content="Rewrite selected text in a more natural, conversational tone"
            side="top"
          >
            <span>
              <Button
                variant="outline"
                className="h-8 rounded-full bg-white hover:bg-gray-50 px-4"
                onClick={handleHumanize}
                disabled={!isTextSelected}
              >
                <Brain className="mr-2 h-4 w-4 text-purple-500" />
                Humanize
              </Button>
            </span>
          </Tooltip>

          <Tooltip content="Transform selected text into a visual infographic" side="top">
            <span>
              <Button
                variant="outline"
                className="h-8 rounded-full bg-white hover:bg-gray-50 px-4"
                onClick={onVisualSelection}
                disabled={!isTextSelected}
              >
                <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
                Create Visual
              </Button>
            </span>
          </Tooltip>

          <Tooltip content="Generate an AI image based on a prompt" side="top">
            <span>
              <Button
                variant="outline"
                className="h-8 rounded-full bg-white hover:bg-gray-50 px-4"
                onClick={() => editor.chain().focus().setAiImage().run()}
              >
                <ImagePlus className="mr-2 h-4 w-4 text-green-500" />
                AI Image
              </Button>
            </span>
          </Tooltip>
        </div>

        {/* Input Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative group w-full"
                    >
                      <div className="flex flex-col">
                        <div className="relative w-full">
                          <div
                            className={cn(
                              "w-full px-7 py-4 bg-gray-50 rounded-t-full rounded-b-full transition-all duration-200",
                              "border border-gray-300",
                            )}
                          >
                            {selectedText && (
                              <div className="mb-2">
                                <div className="inline-flex items-center w-fit max-w-[90%] bg-indigo-100 text-gray-700 text-xs px-2.5 py-1 rounded-full truncate">
                                  <span className="text-gray-500 mr-1.5">Editing:</span>
                                  <span className="truncate">{selectedText}</span>
                                </div>
                              </div>
                            )}
                            <motion.input
                              initial={false}
                              whileFocus={{ boxShadow: "none" }}
                              placeholder={
                                selectedText
                                  ? "Ask AI to enhance your selected text..."
                                  : "Ask AI to enhance your writing..."
                              }
                              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-offset-0"
                              {...field}
                            />
                          </div>
                          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-lg" />
                        </div>
                        <motion.button
                          type="submit"
                          disabled={!field.value || isLoading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                            field.value ? "bg-gray-300 hover:bg-gray-400" : "hover:bg-gray-50",
                          )}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          ) : (
                            <ArrowRight className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
