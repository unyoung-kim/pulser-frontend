import { useEffect, useState } from 'react';
import { Editor, useEditorState } from '@tiptap/react';
import * as Case from 'case';
import {
  ArrowRight,
  CircleDot,
  Download,
  ExternalLink,
  FileCheck,
  Globe,
  Hash,
  Link as LinkIcon,
  ListTree,
  Loader,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface HeadingNode {
  level: number;
  text: string;
  pos: number;
}

interface LinkCount {
  internal: number;
  external: number;
}

interface EditorSidebarProps {
  editor: Editor;
  status: 'drafted' | 'scheduled' | 'published' | 'archived';
  type: string;
  keyword?: string;
  contentId: string;
  onStatusChange?: (newStatus: string) => void;
  internalLinkCount: number;
}

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function EditorSidebar({
  editor,
  status,
  type,
  keyword,
  contentId,
  onStatusChange,
  internalLinkCount,
}: EditorSidebarProps) {
  const { toast } = useToast();
  const [headings, setHeadings] = useState<HeadingNode[]>([]);
  const [linkCount, setLinkCount] = useState<LinkCount>({
    internal: 0,
    external: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { words } = useEditorState({
    editor,
    selector: (ctx) => {
      const { words } = ctx.editor?.storage.characterCount || {
        words: () => 0,
      };
      return { words: words() };
    },
  });

  const getWordCount = () => {
    return words;
  };

  // Update headings and links when content changes
  useEffect(() => {
    const updateHeadingsAndLinks = () => {
      if (!editor) return;

      const newHeadings: HeadingNode[] = [];
      let externalLinks = 0;

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          newHeadings.push({
            level: node.attrs.level,
            text: node.textContent,
            pos,
          });
        }
        // Only count external links from editor content
        if (node.type.name === 'link' || node.marks?.some((mark) => mark.type.name === 'link')) {
          const href =
            node.attrs?.href || node.marks?.find((mark) => mark.type.name === 'link')?.attrs.href;

          if (href) {
            try {
              const url = new URL(href);
              if (url.protocol === 'http:' || url.protocol === 'https:') {
                externalLinks++;
              }
            } catch {
              // Ignore parsing errors for external links
            }
          }
        }
      });

      setHeadings(newHeadings);
      setLinkCount({
        internal: internalLinkCount, // Use the count from database
        external: externalLinks,
      });
    };

    // Initial update
    updateHeadingsAndLinks();

    // Subscribe to editor changes
    const updateListener = () => {
      updateHeadingsAndLinks();
    };

    editor.on('update', updateListener);
    editor.on('selectionUpdate', updateListener);

    return () => {
      editor.off('update', updateListener);
      editor.off('selectionUpdate', updateListener);
    };
  }, [editor, internalLinkCount]); // Add internalLinkCount to dependencies

  const scrollToHeading = (pos: number) => {
    try {
      // Get the parent element that contains the editor content
      const editorElement = editor.view.dom.parentElement;

      if (!editorElement) return;

      // Find all heading elements within the editor
      const headingElements = editorElement.querySelectorAll('h1, h2, h3');

      // Convert NodeList to Array for easier manipulation
      const headingsArray = Array.from(headingElements);

      // Find the index of the heading in our stored headings array
      const headingIndex = headings.findIndex((h) => h.pos === pos);

      if (headingIndex >= 0 && headingsArray[headingIndex]) {
        const headingElement = headingsArray[headingIndex];

        // Calculate the heading's absolute position
        const headingRect = headingElement.getBoundingClientRect();
        const absoluteHeadingTop = headingRect.top + window.pageYOffset;

        // Add offset for fixed header
        const headerOffset = 100; // Adjust this value based on your header height

        // Scroll the heading into view
        window.scrollTo({
          top: absoluteHeadingTop - headerOffset,
          behavior: 'smooth',
        });

        // Add highlight effect
        headingElement.classList.add('highlight-heading');
        setTimeout(() => {
          headingElement.classList.remove('highlight-heading');
        }, 2000);
      }
    } catch (error) {
      console.error('Error scrolling to heading:', error);
    }
  };

  const getHeadingCount = () => {
    let count = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'heading') {
        count++;
      }
    });
    return count;
  };

  const getImageCount = () => {
    let count = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') {
        count++;
      }
    });
    return count;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'drafted':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Use the Export extension to create a Word document
      editor
        .chain()
        .export({
          format: 'docx',
          onExport(context) {
            if (context.error) {
              throw context.error;
            }
            context.download();
          },
        })
        .run();
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to download document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'published' | 'draft') => {
    if (!contentId) return;

    setIsUpdating(true);
    try {
      const updateData: {
        status: 'published' | 'draft';
        updated_at: string;
        published_at?: string;
      } = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      // Add published_at only when publishing
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase.from('Content').update(updateData).eq('id', contentId);

      if (error) throw error;

      // Update local state through callback
      onStatusChange?.(newStatus);

      toast({
        title: newStatus === 'published' ? 'Content Published' : 'Marked as Draft',
        description:
          newStatus === 'published'
            ? 'Your content has been marked as published.'
            : 'Your content has been moved to drafts.',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: `Failed to ${
          newStatus === 'published' ? 'publish' : 'move to drafts'
        }. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const StatusButton = () => {
    if (status === 'published') {
      return (
        <Tooltip side="right" content="Move this content back to drafts">
          <Button
            className="w-full rounded-full bg-indigo-600 text-sm text-white hover:bg-indigo-700"
            size="sm"
            onClick={() => handleStatusChange('draft')}
            disabled={isUpdating}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            {isUpdating ? 'Updating...' : 'Mark as Draft'}
          </Button>
        </Tooltip>
      );
    }

    return (
      <Tooltip side="right" content="Mark this content as published manually">
        <Button
          className="w-full bg-indigo-600 text-sm text-white hover:bg-indigo-700"
          size="sm"
          onClick={() => handleStatusChange('published')}
          disabled={isUpdating}
        >
          <FileCheck className="mr-2 h-4 w-4" />
          {isUpdating ? 'Publishing...' : 'Mark as Published'}
        </Button>
      </Tooltip>
    );
  };

  // const getWordCount = () => {
  //   if (!editor) return 0;
  //   const text = editor.state.doc.textContent;
  //   return text.split(/\s+/).filter((word) => word.length > 0).length;
  // };

  return (
    <div className="flex h-screen w-80 flex-col border-l border-gray-200 bg-white p-6">
      {/* Add Header Section */}
      <div className="mb-6 border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold text-gray-900">Content Details</h2>
        {/* <p className="text-sm text-gray-500 mt-1">
          Manage your content settings and structure
        </p> */}
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto">
        {/* Keywords Section */}
        <div className="pb-2">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Keyword</h3>
          <div className="flex flex-wrap gap-2">
            {keyword ? (
              <Badge
                variant="outline"
                className="border border-gray-50 bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-800"
              >
                {keyword}
              </Badge>
            ) : (
              <span className="text-sm text-gray-500">No keyword assigned</span>
            )}
          </div>
        </div>

        {/* Content Type */}
        <div className="pb-2">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Content Type</h3>
          <Badge
            variant="outline"
            className="border border-indigo-50 bg-purple-100 px-3 py-1 text-xs font-medium capitalize text-indigo-800"
          >
            {Case.capital(type)}
          </Badge>
        </div>

        {/* Status */}
        <div className="pb-2">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Status</h3>
          <Badge
            variant="outline"
            className={`${getStatusColor()} border px-3 py-1 text-xs font-medium capitalize`}
          >
            {status}
          </Badge>
        </div>

        {/* Statistics */}
        <div className="pb-2">
          <h3 className="mb-4 text-sm font-medium text-gray-500">Statistics</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="mb-1 text-sm text-gray-600">Words</div>
              <div className="truncate text-lg font-semibold text-indigo-600">{getWordCount()}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="mb-1 text-sm text-gray-600">Headings</div>
              <div className="truncate text-lg font-semibold text-indigo-600">
                {getHeadingCount()}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="mb-1 text-sm text-gray-600">Images</div>
              <div className="truncate text-lg font-semibold text-indigo-600">
                {getImageCount()}
              </div>
            </div>
          </div>
        </div>

        {/* Outline - Updated styling with icons */}
        <div className="pb-2">
          <div className="mb-4 flex items-center gap-2">
            <ListTree className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">Outline</h3>
          </div>
          <nav className="space-y-2">
            {headings.map((heading, index) => (
              <button
                key={index}
                onClick={() => scrollToHeading(heading.pos)}
                className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-200 hover:bg-gray-50 ${heading.level === 1 ? 'font-medium text-gray-900' : 'text-gray-600'} ${heading.level === 2 ? 'pl-4' : ''} ${heading.level === 3 ? 'pl-8' : ''} `}
              >
                {heading.level === 1 && (
                  <Hash className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
                )}
                {heading.level === 2 && (
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
                )}
                {heading.level === 3 && (
                  <CircleDot className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                )}
                <span className="truncate">{heading.text}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Links */}
        <div className="pb-2">
          <div className="mb-4 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">Links</h3>
          </div>
          <div className="space-y-3 px-2">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{linkCount.internal} internal links</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{linkCount.external} external links</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Updated spacing */}
      <div className="mt-6 space-y-3 border-t pt-6">
        <div className="flex gap-2">
          <Tooltip content="Download as Word document">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          </Tooltip>
          <StatusButton />
        </div>

        <Tooltip
          content="Go to integration section to publish this article to your
                website"
        >
          <Button variant="default" size="sm" className="w-full" disabled>
            <Globe className="mr-2 h-4 w-4" />
            Publish to Website
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
