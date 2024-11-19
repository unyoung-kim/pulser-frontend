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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useState } from "react";

interface KeywordSelectorProps {
  keywords: string[];
  onCreateKeyword: (keyword: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function KeywordSelector({
  keywords,
  onCreateKeyword,
  isLoading,
  error,
}: KeywordSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
    setValue(newKeyword);
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
          {value
            ? keywords.find(
                (keyword) => keyword.toLowerCase() === value.toLowerCase()
              )
            : "Select keyword..."}
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
          <CommandGroup>
            {keywords.map((keyword) => (
              <CommandItem
                key={keyword}
                value={keyword}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toLowerCase() === keyword.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {keyword}
              </CommandItem>
            ))}
          </CommandGroup>
          {inputValue &&
            !keywords.some(
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
