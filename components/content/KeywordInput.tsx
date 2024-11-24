"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useState } from "react";

interface KeywordSelectorProps {
  usedKeywords: string[];
  unusedKeywords: string[];
  selectedKeyword: string;
  onKeywordChange: (keyword: string) => void;
  onCreateKeyword: (keyword: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function KeywordSelector({
  usedKeywords,
  unusedKeywords,
  selectedKeyword,
  onKeywordChange,
  onCreateKeyword,
  isLoading,
  error,
}: KeywordSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading keywords...</div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  const createKeyword = (newKeyword: string) => {
    onCreateKeyword(newKeyword);
    onKeywordChange(newKeyword);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedKeyword || "Select keyword..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
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
          <Tabs defaultValue="unused" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="unused" className="flex-1">
                Unused ({unusedKeywords.length})
              </TabsTrigger>
              <TabsTrigger value="used" className="flex-1">
                Used ({usedKeywords.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="unused">
              <CommandGroup>
                {unusedKeywords.map((keyword) => (
                  <CommandItem
                    key={keyword}
                    value={keyword}
                    onSelect={(currentValue) => {
                      onKeywordChange(
                        currentValue === selectedKeyword ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedKeyword.toLowerCase() === keyword.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {keyword}
                  </CommandItem>
                ))}
              </CommandGroup>
            </TabsContent>
            <TabsContent value="used">
              <CommandGroup>
                {usedKeywords.map((keyword) => (
                  <CommandItem
                    key={keyword}
                    value={keyword}
                    onSelect={(currentValue) => {
                      onKeywordChange(
                        currentValue === selectedKeyword ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedKeyword.toLowerCase() === keyword.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {keyword}
                  </CommandItem>
                ))}
              </CommandGroup>
            </TabsContent>
          </Tabs>
          {inputValue &&
            ![...usedKeywords, ...unusedKeywords].some(
              (k) => k.toLowerCase() === inputValue.toLowerCase()
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
