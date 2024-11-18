import { Editor } from '@tiptap/react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';

interface AIMenuProps {
  editor: Editor;
  show: boolean;
  onHide: () => void;
}

const DEFAULT_AI_COMMANDS = [
  { 
    id: 'continue',
    label: 'Continue writing...',
    description: 'Generate text that continues from the current context'
  },
  {
    id: 'improve',
    label: 'Improve writing',
    description: 'Enhance the selected text'
  },
  {
    id: 'shorten',
    label: 'Make shorter',
    description: 'Create a more concise version'
  },
  {
    id: 'elaborate',
    label: 'Elaborate further',
    description: 'Add more details and explanation'
  },
];

export function AIMenu({ editor, show, onHide }: AIMenuProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onHide();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onHide]);

  const handleAICommand = async (command: string) => {
    const selectedText = editor.state.selection.empty 
      ? editor.getText()
      : editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        );

    // TODO: Implement AI processing here
    console.log('AI Command:', command, 'Selected Text:', selectedText);
    
    onHide();
  };

  if (!show) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-80"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Command>
        <CommandInput 
          placeholder="Type a custom instruction..." 
          value={customPrompt}
          onValueChange={setCustomPrompt}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            {DEFAULT_AI_COMMANDS.map((cmd) => (
              <CommandItem
                key={cmd.id}
                onSelect={() => handleAICommand(cmd.id)}
              >
                <div>
                  <div className="font-medium">{cmd.label}</div>
                  <div className="text-sm text-gray-500">{cmd.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      
      {customPrompt && (
        <div className="p-2 border-t">
          <Button 
            onClick={() => handleAICommand(customPrompt)}
            className="w-full"
          >
            Execute Custom Instruction
          </Button>
        </div>
      )}
    </div>
  );
} 