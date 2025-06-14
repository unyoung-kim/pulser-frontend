'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Command, Info, Loader2, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Tooltip from '@/components/ui/tooltip';
import { useGetKeywordOverview } from '@/lib/apiHooks/keyword/useGetKeywordOverview';
import { useGetUsage } from '@/lib/apiHooks/settings/useGetUsage';
import KeywordSearchResult from './KeywordSearchResult';

const countries = [
  { code: 'us', name: 'United States', sign: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', sign: '🇬🇧' },
  { code: 'ca', name: 'Canada', sign: '🇨🇦' },
  { code: 'in', name: 'India', sign: '🇮🇳' },
];

export default function KeywordMagicTool() {
  const [keyword, setKeyword] = useState('');
  const [difficultyMin, setDifficultyMin] = useState('0');
  const [difficultyMax, setDifficultyMax] = useState('40');
  const [database, setDatabase] = useState('us');

  const { orgId } = useAuth();
  const { data: user, isSuccess: isUsageSuccess } = useGetUsage(orgId);
  const { mutate, data, isPending, isSuccess, reset } = useGetKeywordOverview();

  const region = countries.find((country) => country.code === database)?.name || '';
  const isFreeTrial = isUsageSuccess && user.plan === 'FREE_CREDIT';

  const handleSearch = () => {
    if (keyword.trim() !== '' && orgId) {
      mutate({
        orgId,
        phrase: keyword, // Replace with the target keyword
        database, // Database (e.g., 'us' for United States)
        displayOffset: 0, // Starting offset for results
        kdFilter: Number(difficultyMax),
        isFreeTrial,
      });
    }
  };

  if (data && !isPending && isSuccess) {
    return (
      <KeywordSearchResult
        region={region}
        keywordOverview={data}
        reset={reset}
        isFreeTrial={isFreeTrial}
      />
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-3xl font-semibold md:text-4xl">
          <Command className="h-8 w-8" />
          Keyword Magic Tool
        </CardTitle>
        <CardDescription className="text-lg">
          Find millions of keyword suggestions for your SEO.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-end">
              <Tooltip
                content="Each keyword search will consume 1 credit from your account"
                side="top"
              >
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  1 credit per search <Info className="h-4 w-4" />
                </div>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="h-12 w-full pl-10 pr-24 text-base"
              />
              <Command className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="w-full space-y-2 sm:w-1/2">
                <div className="flex items-center gap-2">
                  <Label>
                    Keyword Difficulty <span className="text-xs font-normal"> (Default: 0-40)</span>
                  </Label>
                  <Tooltip
                    className="max-w-sm"
                    content="Keyword Difficulty indicates how hard it would be to rank for a specific keyword in organic search results. Lower values suggest easier ranking opportunities."
                    side="top"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal"
                    >
                      {difficultyMin} - {difficultyMax}
                      <SlidersHorizontal className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label htmlFor="difficulty-min">Min</Label>
                          <Input
                            id="difficulty-min"
                            placeholder="0"
                            type="number"
                            min="0"
                            max="100"
                            value={difficultyMin}
                            onChange={(e) => setDifficultyMin(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="difficulty-max">Max</Label>
                          <Input
                            id="difficulty-max"
                            placeholder="40"
                            type="number"
                            min="0"
                            max="100"
                            value={difficultyMax}
                            onChange={(e) => setDifficultyMax(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full space-y-2 sm:w-1/2">
                <div className="flex items-center gap-2">
                  <Label>Region </Label>
                </div>
                <Select defaultValue="us">
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((db) => (
                      <SelectItem
                        key={db.code}
                        value={db.code}
                        onClick={() => setDatabase(db.code)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{db.sign}</span> {db.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
