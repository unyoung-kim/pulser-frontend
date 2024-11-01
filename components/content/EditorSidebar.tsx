import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Badge } from '@/components/ui/badge';
import { 
  Heading1, 
  Image as ImageIcon, 
  Text,
  Link as LinkIcon,
  ExternalLink,
  ListTree
} from 'lucide-react';

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
  mainKeyword?: string;
}

export function EditorSidebar({ editor, status, mainKeyword }: EditorSidebarProps) {
  const [headings, setHeadings] = useState<HeadingNode[]>([]);
  const [linkCount, setLinkCount] = useState<LinkCount>({ internal: 0, external: 0 });

  // Update headings and links when content changes
  useEffect(() => {
    const updateHeadingsAndLinks = () => {
      const newHeadings: HeadingNode[] = [];
      let internalLinks = 0;
      let externalLinks = 0;

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          newHeadings.push({
            level: node.attrs.level,
            text: node.textContent,
            pos: pos
          });
        }
        if (node.type.name === 'link') {
          const href = node.attrs.href;
          if (href.startsWith('http')) {
            externalLinks++;
          } else {
            internalLinks++;
          }
        }
      });

      setHeadings(newHeadings);
      setLinkCount({ internal: internalLinks, external: externalLinks });
    };

    // Initial update
    updateHeadingsAndLinks();

    // Subscribe to editor changes
    editor.on('update', updateHeadingsAndLinks);

    return () => {
      editor.off('update', updateHeadingsAndLinks);
    };
  }, [editor]);

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
      const headingIndex = headings.findIndex(h => h.pos === pos);
      
      if (headingIndex >= 0 && headingsArray[headingIndex]) {
        const headingElement = headingsArray[headingIndex];
        
        // Get the editor container's offset from the top of the page
        const editorContainer = document.querySelector('.prose-container');
        const editorOffset = editorContainer?.getBoundingClientRect().top ?? 0;
        
        // Calculate the heading's absolute position
        const headingRect = headingElement.getBoundingClientRect();
        const absoluteHeadingTop = headingRect.top + window.pageYOffset;
        
        // Add offset for fixed header
        const headerOffset = 100; // Adjust this value based on your header height
        
        // Scroll the heading into view
        window.scrollTo({
          top: absoluteHeadingTop - headerOffset,
          behavior: 'smooth'
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

  const getWordCount = () => {
    const text = editor.state.doc.textContent;
    return text.trim().split(/\s+/).length;
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

  return (
    <div className="w-64 border-l border-gray-200 p-4 space-y-6 h-screen overflow-y-auto bg-white">
      {/* Main Keyword */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Main Keyword</h3>
        <p className="text-sm font-medium">
          {mainKeyword || 'No keyword set'}
        </p>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
        <Badge 
          variant="outline" 
          className={`${getStatusColor()} border px-3 py-1 text-xs font-medium capitalize`}
        >
          {status}
        </Badge>
      </div>

      {/* Statistics */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Statistics</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Text className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{getWordCount()} words</span>
          </div>
          <div className="flex items-center gap-2">
            <Heading1 className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{getHeadingCount()} headings</span>
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{getImageCount()} images</span>
          </div>
        </div>
      </div>

      {/* Outline */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ListTree className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-500">Outline</h3>
        </div>
        <nav className="space-y-1">
          {headings.map((heading, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(heading.pos)}
              className={`
                text-sm text-gray-600 hover:text-gray-900 block w-full text-left
                ${heading.level === 1 ? 'font-medium' : ''}
                ${heading.level === 2 ? 'pl-3' : ''}
                ${heading.level === 3 ? 'pl-6' : ''}
              `}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>

      {/* Links */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-500">Links</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{linkCount.internal} internal links</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{linkCount.external} external links</span>
          </div>
        </div>
      </div>
    </div>
  );
} 