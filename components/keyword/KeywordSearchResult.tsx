'use client';

import React, { useEffect, useState } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ArrowLeft, BarChart2, HelpCircle, Search } from 'lucide-react';
import CostPerClickSEO from '@/components/keyword/CostPerClickSEO';
import KeywordDifficultyBadge from '@/components/keyword/KeywordDifficultyBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cpcCaption, keywordDifficultyCaption, searchVolumeCaption } from '@/lib/utils/keyword';
import { columns } from './columns';
import { DataTable } from './data-table';
import Tooltip from '../ui/tooltip';

type KeywordData = {
  keyword: string;
  searchVolume: number;
  competition: string;
  intent: string;
  trends: string;
};

interface KeywordResearchResultProps {
  region: string;
  intent: string[];
  keywordOverview: any;
  reset: () => void;
}

export default function KeywordResearchResult({
  region,
  intent,
  keywordOverview,
  reset,
}: KeywordResearchResultProps) {
  const [listData, setListData] = useState<KeywordData[]>(keywordOverview.broadMatches);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const filteredData = keywordOverview.broadMatches.filter((item: KeywordData) =>
      item.keyword.toLowerCase().includes(search.toLowerCase().trim())
    );
    setListData(filteredData);
  }, [search, keywordOverview.broadMatches]);

  const handleBack = () => reset();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const overview = keywordOverview.inputKeywordOverview;

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold capitalize">{overview.keyword}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted-foreground">{region}</span>
              {intent.length > 0 && <span className="text-muted-foreground">•</span>}
              <p className="text-xs font-semibold capitalize">{intent.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search volume</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.searchVolume}</div>
            <p className="text-xs text-muted-foreground">
              {searchVolumeCaption(overview.searchVolume)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difficulty</CardTitle>
            <TooltipProvider>
              <Tooltip content="How difficult it is to rank for this keyword">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{overview.keywordDifficultyIndex}</div>
              <KeywordDifficultyBadge difficulty={overview.keywordDifficulty} />
            </div>
            <p className="text-xs text-muted-foreground">
              {keywordDifficultyCaption(overview.keywordDifficulty)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per click</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">${overview.CPC}</div>
              <CostPerClickSEO cpc={overview.CPC} />
            </div>
            <p className="text-xs text-muted-foreground">{cpcCaption(overview.CPC)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic potential</CardTitle>
            <TooltipProvider>
              <Tooltip content="Estimated monthly traffic if ranked in top 10">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500</div>
            <p className="text-xs text-muted-foreground">Monthly visits</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Related Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keywords..."
                value={search}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          </div>
          <DataTable columns={columns} data={listData} />
        </CardContent>
      </Card>
    </div>
  );
}
