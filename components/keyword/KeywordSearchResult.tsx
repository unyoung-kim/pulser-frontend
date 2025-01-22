'use client';

import Image from 'next/image';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ArrowDownUp, BarChart2, Download, HelpCircle, RefreshCw, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import Tooltip from '../ui/tooltip';

export default function KeywordResearchResult() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Denial Management</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-muted-foreground">United States</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">143 keyword ideas</span>
            <Badge variant="secondary" className="ml-2">
              Informational
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search volume</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,400</div>
            <p className="text-xs text-muted-foreground">Good demand, competitive keywords</p>
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
              <div className="text-2xl font-bold">6</div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Low
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Easy to rank for, less competition</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per click</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">$2</div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                Medium
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Medium CPC, reasonable investment</p>
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
              <Input placeholder="Search keywords..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="volume">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="cpc">CPC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Keywords</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Volume
                    <ArrowDownUp className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>denial management interview questions</TableCell>
                <TableCell>50</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    0
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Informational
                  </Badge>
                </TableCell>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=30&width=100"
                    alt="Trend graph"
                    width={100}
                    height={30}
                    className="opacity-75"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>medical denial management software</TableCell>
                <TableCell>890</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    45
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Commercial
                  </Badge>
                </TableCell>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=30&width=100"
                    alt="Trend graph"
                    width={100}
                    height={30}
                    className="opacity-75"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>healthcare denial management process</TableCell>
                <TableCell>320</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    12
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Informational
                  </Badge>
                </TableCell>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=30&width=100"
                    alt="Trend graph"
                    width={100}
                    height={30}
                    className="opacity-75"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>best denial management companies</TableCell>
                <TableCell>210</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    78
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Commercial
                  </Badge>
                </TableCell>
                <TableCell>
                  <Image
                    src="/placeholder.svg?height=30&width=100"
                    alt="Trend graph"
                    width={100}
                    height={30}
                    className="opacity-75"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
