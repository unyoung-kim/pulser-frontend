"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Keyword {
  id: number;
  word: string;
}

// This would typically come from an API or database
const mockKeywords: Keyword[] = [
  { id: 1, word: "SEO" },
  { id: 2, word: "Content Marketing" },
  { id: 3, word: "Backlinks" },
  { id: 4, word: "Google Analytics" },
  { id: 5, word: "Meta Tags" },
  // ... add more keywords as needed
];

export default function KeywordAdditionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    const filtered = mockKeywords.filter((keyword) =>
      keyword.word.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredKeywords(filtered);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddKeyword = (keyword: string) => {
    console.log(`Adding keyword: ${keyword}`);
    // Here you would typically add the keyword to your database or state
    setIsOpen(false);
    setSearchTerm("");
    setNewKeyword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
          <Plus className="mr-2 h-4 w-4" /> Add Keyword
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Keyword</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search keywords"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[200px]">
                {filteredKeywords.map((keyword) => (
                  <Button
                    key={keyword.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleAddKeyword(keyword.word)}
                  >
                    {keyword.word}
                  </Button>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="add">
            <div className="space-y-4">
              <Input
                placeholder="Enter new keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
              <Button
                onClick={() => handleAddKeyword(newKeyword)}
                disabled={!newKeyword.trim()}
                className="w-full"
              >
                Add Keyword
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
