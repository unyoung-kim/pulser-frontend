'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Check, Link as LinkIcon } from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/lib/supabaseClient';
import { getPathFromURL } from '@/lib/url';

interface LinkPanelProps {
  onSelect: (url: string) => void;
}

export default function LinkPanel({ onSelect }: LinkPanelProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [isExternalLink, setIsExternalLink] = React.useState(false);

  const { projectId } = useParams();

  const { data: internalLinks } = useQuery({
    queryKey: ['internalLinks', projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from('InternalLink')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsExternalLink(value.startsWith('http://') || value.startsWith('https://'));
  };

  const handleSelect = (value: string) => {
    if (isExternalLink) {
      onSelect(inputValue);
    } else {
      const selectedLink = internalLinks?.find((link) => link.title === value);
      if (selectedLink) {
        onSelect(selectedLink.url);
      }
    }
  };

  return (
    <div className="w-full">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Paste external link or search your internal pages"
          value={inputValue}
          onValueChange={handleInputChange}
        />
        <CommandList>
          {isExternalLink && (
            <CommandGroup heading="External Link">
              <CommandItem
                className="flex items-center gap-2 py-3"
                onSelect={() => handleSelect(inputValue)}
              >
                <LinkIcon className="h-4 w-4" />
                <span className="flex-1 truncate">{inputValue}</span>
                <Check className="h-4 w-4 opacity-0 group-aria-selected:opacity-100" />
              </CommandItem>
            </CommandGroup>
          )}
          {/* <CommandEmpty>No results found.</CommandEmpty> */}
          <CommandGroup
            heading="Internal Links"
            className="[&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-[#4f46e5]"
          >
            {internalLinks?.map((link) => (
              <CommandItem
                key={link.id}
                value={link.url}
                onSelect={() => handleSelect(link.summary)}
                className="flex items-center gap-3 py-4"
              >
                <LinkIcon className="h-4 w-4 flex-shrink-0" />
                <div className="flex flex-1 flex-col justify-center overflow-hidden">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-bold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getPathFromURL(link.url)}
                  </a>
                  {link.summary && (
                    <span className="truncate text-sm text-muted-foreground">{link.summary}</span>
                  )}
                </div>
                <Check className="h-4 w-4 opacity-0 group-aria-selected:opacity-100" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
