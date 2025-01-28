'use client';

import { ArrowUpDown } from 'lucide-react';
import { Bar, BarChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import type { ColumnDef } from '@tanstack/react-table';

// Mock data for trends
const trendData = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  value: Math.floor(Math.random() * 100),
}));

export type KeywordData = {
  keyword: string;
  searchVolume: number;
  competition: string;
  intent: string;
  trends: string;
};

export const columns: ColumnDef<KeywordData>[] = [
  {
    accessorKey: 'keyword',
    header: 'Keywords',
    cell: ({ row }) => <div className="font-medium capitalize">{row.getValue('keyword')}</div>,
  },
  {
    accessorKey: 'searchVolume',
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-between">
          <span>Volume</span>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue('searchVolume')}</div>,
  },
  {
    accessorKey: 'competition',
    header: 'Competition',
    cell: ({ row }) => {
      const competition = row.getValue('competition') as string;
      return (
        <Badge
          variant="secondary"
          className={`rounded-full ${
            Number.parseInt(competition) === 0
              ? 'bg-green-100 text-green-700'
              : Number.parseInt(competition) <= 33
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          {competition}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'intent',
    header: 'Intent',
    cell: ({ row }) => {
      const intent = row.getValue('intent') as string;
      return (
        <Badge
          variant="secondary"
          className={`rounded-full ${
            intent === 'Commercial'
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800'
              : 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800'
          }`}
        >
          {intent}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'trends',
    header: 'Trend',
    cell: () => (
      <ChartContainer
        config={{
          value: {
            label: 'Trend',
            color: 'hsl(252, 100%, 68%)',
          },
        }}
        className="h-[30px]"
      >
        <BarChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="value" fill="hsl(252, 100%, 68%)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartContainer>
    ),
  },
];
