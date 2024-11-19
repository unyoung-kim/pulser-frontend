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
    <Card className="w-full">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2 mt-1">
            <div className="text-red-600 w-6 h-6">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                <path
                  fill="white"
                  d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </div>
            {/* <Search className="w-6 h-6" /> */}
            <span className="text-lg font-semibold">Search YouTube Videos</span>
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

        {results.length > 0 ? (
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
        ) : (
          <div className="min-h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground text-center">
            <Search className="h-12 w-12 mb-4 opacity-50" />
            <p>Search for YouTube videos to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
