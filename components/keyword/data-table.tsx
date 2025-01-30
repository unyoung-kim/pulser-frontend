'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Save, Search, Lock, ChevronDown } from 'lucide-react';
import { KeywordData } from '@/components/keyword/KeywordSearchResult';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PaginationControls } from './pagination-controls';
import { Input } from '../ui/input';

interface DataTableProps<TData extends KeywordData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSaveSelected?: (selectedRows: TData[]) => void;
  isSaved: boolean;
  isFreeTrial: boolean;
  // intentOptions: { id: string; label: string }[];
}

// const intentOptions = [
//   { id: 'informational', label: 'Informational' },
//   { id: 'transactional', label: 'Transactional' },
//   { id: 'navigational', label: 'Navigational' },
//   { id: 'commercial', label: 'Commercial' },
// ];

export function DataTable<TData extends KeywordData, TValue>({
  columns,
  data,
  onSaveSelected,
  isSaved,
  isFreeTrial,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [intent, setIntent] = useState<string[]>([]);

  const { projectId } = useParams();
  const router = useRouter();

  const tableData = useMemo(() => {
    return data.filter((item) => item.keyword?.toLowerCase().includes(search.toLowerCase().trim()));
  }, [data, search]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      pagination,
      rowSelection,
    },
  });

  useEffect(() => {
    if (isSaved) {
      table.setRowSelection({});
    }
  }, [isSaved, table]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search keywords..."
              value={search}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                {intent.length > 0 ? `${intent.length} selected` : 'Select intent'}
                <SlidersHorizontal className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                {intentOptions.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={intent.includes(item.id)}
                      onCheckedChange={(checked) => {
                        setIntent(
                          checked ? [...intent, item.id] : intent.filter((i) => i !== item.id)
                        );
                      }}
                    />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover> */}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
              onSaveSelected?.(selectedRows);
            }}
            className="flex items-center gap-2"
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <Save className="h-4 w-4" />
            Save Selected ({table.getSelectedRowModel().rows.length})
          </Button>
        </div>
      </div>

      <div className={cn('relative', isFreeTrial && 'min-h-[28rem]')}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={isFreeTrial && index >= 5 ? 'pointer-events-none blur-sm' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="max-w-[270px] px-4 py-2" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {tableData.length > 10 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <PaginationControls table={table} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {isFreeTrial && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="flex flex-col items-center bg-gradient-to-t from-background via-background/95 to-transparent px-4 py-8">
              {/* Premium Content Banner */}
              <div className="w-full max-w-2xl space-y-6 text-center">
                <div className="rounded-2xl border border-purple-500/10 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 p-6 backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-75 blur-sm" />
                      <div className="relative rounded-full bg-background p-2">
                        <Lock className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Premium Insights
                    </span>
                  </div>

                  <h3 className="mb-3 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-xl font-semibold text-transparent">
                    Unlock {data.length - 5}+ High-Converting Keywords
                  </h3>

                  <p className="mb-6 text-sm text-muted-foreground">
                    Get access to all keywords, advanced metrics, and competitor insights with our
                    Pro plan
                  </p>

                  {/* Feature List */}
                  <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
                    {[
                      'Unlimited keyword results',
                      'Advanced intent analysis',
                      'Competitor tracking',
                      'Trend predictions',
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => router.push(`/projects/${projectId}/settings`)}
                    className="w-full max-w-sm bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-purple-600 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    <span className="flex items-center gap-2">
                      Upgrade to Pro
                      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
