'use client';

import { ArrowUpDown, Save } from 'lucide-react';
import { Bar, BarChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { intentBadgeClass, keywordDifficultyBadgeClass, trendData } from '@/lib/utils/keyword';
import type { ColumnDef } from '@tanstack/react-table';

export type KeywordData = {
  id: string;
  keyword: string;
  searchVolume: number;
  competition: string;
  intent: string;
  trends: string;
};

export const columns: ColumnDef<KeywordData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({ row }) => <div>{Number(row.getValue('searchVolume')).toLocaleString()}</div>,
  },
  {
    accessorKey: 'keywordDifficultyIndex',
    header: 'Difficulty',
    cell: ({ row }) => {
      const keywordDifficultyIndex = row.getValue('keywordDifficultyIndex') as string;
      return (
        <Badge
          variant="secondary"
          className={cn(
            'rounded-full',
            keywordDifficultyBadgeClass(Number(keywordDifficultyIndex))
          )}
        >
          {Number(keywordDifficultyIndex)}
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
        <Badge variant="secondary" className={cn('rounded-full', intentBadgeClass(intent))}>
          {intent}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'trends',
    header: 'Trend',
    cell: ({ row }) => {
      const trend = row.getValue('trends') as string;
      return (
        <ChartContainer
          config={{
            value: {
              label: 'Trend',
              color: 'hsl(252, 100%, 68%)',
            },
          }}
          className="h-[30px]"
        >
          <BarChart
            data={trendData(trend.split(','))}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <Bar dataKey="value" fill="hsl(252, 100%, 68%)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const keyword = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleSaveKeyword(keyword)}
          className="opacity-0 group-hover:opacity-100"
        >
          <Save className="h-4 w-4" />
        </Button>
      );
    },
  },
];

const handleSaveKeyword = (keyword: KeywordData) => {
  // Implement your save logic here
  console.log('Saving keyword:', keyword);
};
