'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { youtubeSearch } from '@/constants/urlConstant';

interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export interface YoutubeSearchProps {
  onSelect: (videoId: string) => void;
  onClose: () => void;
  editor: any;
}

export default function YoutubeSearch({ onSelect, onClose, editor }: YoutubeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(youtubeSearch, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      const data = await response.json();
      console.log('DATA ===', data);
      if (!data.success) {
        throw new Error('Failed to fetch videos');
      }

      setResults(
        data.data.map((item: any) => ({
          id: item.link.split('v=')[1],
          title: item.title,
          thumbnail: `https://i.ytimg.com/vi/${item.link.split('v=')[1]}/mqdefault.jpg`,
          channelTitle: item.channelTitle || 'YouTube Channel',
        }))
      );
    } catch (err) {
      setError('Failed to search videos. Please try again.');
      console.error('Video search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoSelect = (videoId: string) => {
    console.log('video id', videoId);
    console.log('editor instance:', editor);

    if (editor) {
      console.log('Setting YouTube video...');
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: `https://www.youtube.com/watch?v=${videoId}`,
          width: 640,
          height: 480,
        })
        .run();
      onClose();
    } else {
      console.warn('Editor instance not available');
      onSelect(videoId);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="mt-1 flex items-center gap-2">
            <div className="h-6 w-6 text-red-600">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                <path fill="white" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
        <form onSubmit={handleSubmit} className="mb-4 flex w-full items-center space-x-2">
          <Input
            type="search"
            placeholder="Search YouTube videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={!query || isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>

        <ScrollArea className="h-[400px] w-full rounded-md">
          {error ? (
            <div className="flex min-h-[300px] w-full flex-col items-center justify-center text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-2 px-4">
              {results.map((video) => (
                <div
                  key={video.id}
                  className="flex cursor-pointer gap-3 rounded-lg border p-2 transition-colors hover:bg-accent"
                  onClick={() => handleVideoSelect(video.id)}
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={128}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="line-clamp-2 text-sm font-semibold">{video.title}</h3>
                    <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[300px] w-full flex-col items-center justify-center text-center text-muted-foreground">
              <Search className="mb-4 h-12 w-12 opacity-50" />
              <p>Search for YouTube videos to get started</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
