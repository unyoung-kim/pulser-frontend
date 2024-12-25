'use client';

import * as React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BACKEND_URL } from '@/lib/url';


interface ImageSearchModalProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

interface ImageSearchResult {
  url: string;
  thumbnail: string;
  title: string;
}

export function ImageSearchModal({ onSelect, onClose }: ImageSearchModalProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ImageSearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/image-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchTerm
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch images');
      }
      console.log('DATA ===', data);
      setSearchResults(data.data.map((item: any) => ({
        url: item.image_url,
        title: item.image_title
      })));
    } catch (err) {
      setError('Failed to search images. Please try again.');
      console.error('Image search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 my-1">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Google">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Search Images
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search for images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {error ? (
            <div className="min-h-[300px] w-full flex flex-col items-center justify-center text-red-500 text-center">
              <p>{error}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {searchResults.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(image.url)}
                  className="border rounded-md overflow-hidden hover:opacity-80"
                >
                  <Image
                    src={image.url}
                    alt={image.title || `Search result ${index + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="min-h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground text-center">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p>Search for copyright-free images to use in your content</p>
              <p className="text-sm mt-2 text-muted-foreground">
                All results are filtered to be safe for commercial use
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
