'use client';

import { useParams } from 'next/navigation';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, DollarSign, Gauge, Search, TrendingUp } from 'lucide-react';
import { Bar, BarChart } from 'recharts';
import CostPerClickSEO from '@/components/keyword/CostPerClickSEO';
import KeywordDifficultyBadge from '@/components/keyword/KeywordDifficultyBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { useCreateKeywords } from '@/lib/apiHooks/keyword/useCreateKeywords';
import {
  cpcCaption,
  keywordDifficultyCaption,
  searchVolumeCaption,
  trendData,
} from '@/lib/utils/keyword';
import { columns } from './columns';
import { DataTable } from './data-table';
import Tooltip from '../ui/tooltip';

export type KeywordData = {
  CPC: string;
  keyword: string;
  keywordDifficultyIndex: string;
  searchVolume: number;
  competition: string;
  intent: string;
  trends: string;
};

interface KeywordResearchResultProps {
  region: string;
  keywordOverview: any;
  reset: () => void;
  isFreeTrial: boolean;
}

export default function KeywordResearchResult({
  region,
  keywordOverview,
  reset,
  isFreeTrial,
}: KeywordResearchResultProps) {
  const { projectId } = useParams() as { projectId: string };
  const { mutate: createKeywords, isSuccess: isSaved } = useCreateKeywords(projectId);

  const handleBack = () => reset();
  const handleSaveSelected = (selectedRows: KeywordData[]) => {
    const formattedKeywords = selectedRows.map((row: KeywordData) => ({
      keyword: row.keyword,
      cpc: parseFloat(row.CPC),
      difficulty: parseInt(row.keywordDifficultyIndex),
      volume: row.searchVolume,
      intent: row.intent.toUpperCase() as
        | 'COMMERCIAL'
        | 'INFORMATIONAL'
        | 'NAVIGATIONAL'
        | 'TRANSACTIONAL',
      trend: row.trends.split(',').map((t) => parseFloat(t)),
    }));

    createKeywords(formattedKeywords);
  };

  const overview = keywordOverview.inputKeywordOverview;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold capitalize">{overview.keyword}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted-foreground">{region}</span>
              <span className="text-muted-foreground">•</span>
              <p className="text-xs font-semibold capitalize">
                {keywordOverview.inputKeywordOverview.intent}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search volume</CardTitle>
            <Tooltip content="The total number of times this keyword is searched per month">
              <Search className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(overview.searchVolume).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {searchVolumeCaption(overview.searchVolume)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difficulty</CardTitle>
            <TooltipProvider>
              <Tooltip content="The level of competition to rank for this keyword">
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{overview.keywordDifficultyIndex}</div>
              <KeywordDifficultyBadge difficulty={overview.keywordDifficultyIndex} />
            </div>
            <p className="text-xs text-muted-foreground">
              {keywordDifficultyCaption(overview.keywordDifficultyIndex)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per click</CardTitle>
            <Tooltip content="The average cost per click for this keyword in paid ads">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
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
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TooltipProvider>
              <Tooltip content="Shows the keyword's popularity trend over time">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="pb-2">
            <ChartContainer
              config={{
                value: {
                  label: 'Trend',
                  color: 'hsl(252, 100%, 68%)',
                },
              }}
              className="h-12"
            >
              <BarChart
                data={trendData(keywordOverview.inputKeywordOverview.trends.split(','))}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <Bar dataKey="value" fill="hsl(252, 100%, 68%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Related Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns as ColumnDef<KeywordData, unknown>[]}
            data={keywordOverview.broadMatches}
            onSaveSelected={handleSaveSelected}
            isSaved={isSaved}
            isFreeTrial={isFreeTrial}
          />
        </CardContent>
      </Card>
    </div>
  );
}
