"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export interface YoutubeSearchProps {
  onSelect: (videoId: string) => void;
  onClose: () => void;
}

export default function YoutubeSearch({
  onSelect,
  onClose,
}: YoutubeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VideoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated search function - replace with actual YouTube API call
  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate results
    setResults([
      {
        id: "1",
        title: "Introduction to Web Development",
        thumbnail: "/placeholder.svg?height=180&width=320",
        channelTitle: "Tech Channel",
      },
      {
        id: "2",
        title: "React Hooks Tutorial",
        thumbnail: "/placeholder.svg?height=180&width=320",
        channelTitle: "Code Masters",
      },
      {
        id: "3",
        title: "Building Modern UIs",
        thumbnail: "/placeholder.svg?height=180&width=320",
        channelTitle: "Design Pro",
      },
    ]);
    setIsSearching(false);
  };

  return (
    <Card className="my-4 w-full">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search YouTube Videos
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3">
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search for videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={!query || isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="grid gap-2">
            {results.map((video) => (
              <div
                key={video.id}
                className="flex gap-3 p-2 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                onClick={() => onSelect(video.id)}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={128}
                  height={80}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold line-clamp-2 text-sm">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {video.channelTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
