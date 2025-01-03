'use client';

import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { AiStorage } from '@tiptap-pro/extension-ai';
import {
  ArrowRight,
  Trash2,
  Check,
  RefreshCw,
  Loader2,
  UserRound,
  PieChart,
  WandSparkles
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  useTextmenuCommands
} from '@/components/new-editor/menus/TextMenu/hooks/useTextmenuCommands';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Prompt must be at least 1 character.',
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
please prioritize making the text engaging, clear, and relatable.
Instruction: `;

// utility function to check if the text is a heading
const isHeading = (text: string | string[]): boolean => {
  return text.length <= 60 && !text.includes('.');
};

export function AiPromptInput({ editor }: AiPromptInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { onVisualSelection } = useTextmenuCommands(editor);

  // Get the generated text and loading state from the editor
  const { isLoading, generatedText, error } = useEditorState({
    editor,
    selector: (ctx) => {
      const aiStorage = ctx.editor.storage.ai as AiStorage;
      return {
        isLoading: aiStorage.state === 'loading',
        generatedText: aiStorage.response,
        error: aiStorage.error,
      };
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  // Handle form submission
  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    const { from, to } = editor.state.selection;
    const selectedText= editor.state.doc.textBetween(from, to);
    const textToInsert = selectedText ? `${values.prompt}: ${selectedText}` : values.prompt;

    editor
      .chain()
      .focus()
      .aiTextPrompt({
        stream: true,
        format: 'rich-text',
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
    const selectedText= editor.state.doc.textBetween(from, to);

    if(selectedText.length === 0){
      toast({ description: 'Select Text first', variant: 'destructive' });
      return;
    }

    const instruction = isHeading(selectedText)
      ? 'Humanize this heading to make it clear and conversational: '
      : 'Humanize this paragraph to make it friendly and relatable: ';

    const finalPrompt = HUMANIZE_PROMPT + instruction;

    form.setValue('prompt', finalPrompt);
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
      toast({ description: error.message, variant: 'destructive' });
    }
  }, [error]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-4 pt-2">
      <div className=" px-4 flex">
        <div className="flex-1">
          <div className="w-full sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-2xl mx-auto">
            <div
              className={cn(
                'mb-4 overflow-hidden rounded-lg bg-g p-4 drop-shadow-lg ring-0 bg-white ring-primary/10 transition-all duration-300',
                isVisible && generatedText ? 'opacity-100 max-h-[20rem]' : 'opacity-0 max-h-0',
              )}
            >
              <div className="prose prose-sm max-h-[14rem] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: generatedText || '' }} />
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

            <div
              className={cn(
                'w-full pl-1 transition-all duration-200 ease-in-out',
                (isVisible && generatedText && 'hidden'),
                'mb-2'
              )}
            >
              <div className="flex gap-2 justify-start">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border shadow-sm hover:shadow-md transition-shadow"
                  onClick={handleHumanize}
                  size="sm"
                >
                  <UserRound className="h-4 w-4 text-blue-500" />
                  Humanize
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border shadow-sm hover:shadow-md transition-shadow"
                  onClick={onVisualSelection}
                  size="sm"
                >
                  <PieChart className="h-4 w-4 text-green-500" />
                  Create visual
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border shadow-sm hover:shadow-md transition-shadow"
                  onClick={()=> editor.chain().focus().setAiImage().run()}
                  size="sm"
                >
                  <WandSparkles className="h-4 w-4 text-orange-500" />
                  Ai Image
                </Button>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="relative">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            placeholder="Ask AI to enhance your writing..."
                            className="h-12 rounded-full pr-12 drop-shadow-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                          <Button
                            type="submit"
                            size="icon"
                            className={cn(
                              'absolute right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90',
                              isLoading && 'cursor-not-allowed opacity-50',
                            )}
                            aria-label="Send prompt"
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
        {/*This empty div is needed to center the AI prompt*/}
        <div className="basis-80"></div>
      </div>
    </div>
  );
}
