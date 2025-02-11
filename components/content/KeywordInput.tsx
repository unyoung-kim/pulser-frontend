'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateKeywords } from '@/lib/apiHooks/keyword/useCreateKeywords';
import { useGetKeywords } from '@/lib/apiHooks/keyword/useGetKeywords';
import { cn } from '@/lib/utils';
import { filterKeywords } from '@/lib/utils/keyword';

interface KeywordSelectorProps {
  selectedKeyword: string;
  onKeywordChange: (keyword: string) => void;
}

export default function KeywordSelector({
  selectedKeyword,
  onKeywordChange,
}: KeywordSelectorProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { projectId } = useParams() as { projectId: string };
  const { mutate: onCreateKeyword } = useCreateKeywords(projectId);
  const { data: keywords = [], isLoading, error } = useGetKeywords(projectId);
  const usedKeywords = useMemo(() => filterKeywords(keywords, 'used'), [keywords]);
  const unusedKeywords = useMemo(() => filterKeywords(keywords, 'unused'), [keywords]);
  const scheduledKeywords = useMemo(() => filterKeywords(keywords, 'scheduled'), [keywords]);

  useEffect(() => {
    if (selectedKeyword) {
      const word = keywords.find((k) => k.id === selectedKeyword)?.keyword;
      setLabel(word ?? '');
    }
  }, [keywords, selectedKeyword]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading keywords...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Error: {error instanceof Error ? error.message : null}
      </div>
    );
  }

  const handleKeywordSelect = (currentValue: string, keywordLabel: string) => {
    if (currentValue !== selectedKeyword) {
      onKeywordChange(currentValue);
      setLabel(keywordLabel);
    } else {
      onKeywordChange('');
      setLabel('');
    }
    setOpen(false);
  };

  const createKeyword = (newKeyword: string) => {
    onCreateKeyword({ keyword: newKeyword });
    onKeywordChange(newKeyword);
    setLabel(newKeyword);
    setInputValue('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between capitalize"
          onClick={() => (document.body.style.pointerEvents = '')}
        >
          {label || 'Select keyword...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 capitalize" align="start">
        <Command className="w-full">
          <CommandInput
            placeholder="Search keyword..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => createKeyword(inputValue)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create &quot;{inputValue}&quot;
            </Button>
          </CommandEmpty>
          <CommandGroup heading={`Unused (${unusedKeywords.length})`}>
            {unusedKeywords.map((keyword) => (
              <CommandItem
                key={keyword.value}
                value={keyword.value}
                onSelect={(currentValue) => handleKeywordSelect(currentValue, keyword.label)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedKeyword === keyword.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {keyword.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={`Used (${usedKeywords.length})`}>
            {usedKeywords.map((keyword) => (
              <CommandItem
                key={keyword.value}
                value={keyword.value}
                onSelect={(currentValue) => handleKeywordSelect(currentValue, keyword.label)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedKeyword === keyword.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {keyword.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={`Scheduled (${scheduledKeywords.length})`}>
            {scheduledKeywords.map((keyword) => (
              <CommandItem
                key={keyword.value}
                value={keyword.value}
                onSelect={(currentValue) => handleKeywordSelect(currentValue, keyword.label)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedKeyword === keyword.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {keyword.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {inputValue &&
            ![...usedKeywords, ...unusedKeywords, ...scheduledKeywords].some(
              (k) => k.label.toLowerCase() == inputValue.toLowerCase()
            ) && (
              <CommandGroup>
                <CommandItem
                  className="text-muted-foreground"
                  onSelect={() => createKeyword(inputValue)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create &quot;{inputValue}&quot;
                </CommandItem>
              </CommandGroup>
            )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
