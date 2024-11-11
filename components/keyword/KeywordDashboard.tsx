"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  CheckCircle,
  Hash,
  Search,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Keyword {
  id: number;
  word: string;
  used: boolean;
  usageCount: number;
  source: "user" | "pulser";
  score: number;
}

export default function KeywordDashboard() {
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: 1,
      word: "SEO",
      used: true,
      usageCount: 5,
      source: "user",
      score: 85,
    },
    {
      id: 2,
      word: "Content Marketing",
      used: false,
      usageCount: 0,
      source: "pulser",
      score: 72,
    },
    {
      id: 3,
      word: "Backlinks",
      used: true,
      usageCount: 3,
      source: "user",
      score: 90,
    },
    {
      id: 4,
      word: "Google Analytics",
      used: false,
      usageCount: 0,
      source: "pulser",
      score: 68,
    },
    {
      id: 5,
      word: "Meta Tags",
      used: true,
      usageCount: 2,
      source: "user",
      score: 78,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usedThisMonth = keywords.filter((keyword) => keyword.used).length;
  const totalKeywords = keywords.length;
  const percentageUsed = (usedThisMonth / totalKeywords) * 100;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUpload = () => {
    // Mock upload functionality
    const newKeyword: Keyword = {
      id: keywords.length + 1,
      word: `New Keyword ${keywords.length + 1}`,
      used: false,
      usageCount: 0,
      source: "user",
      score: Math.floor(Math.random() * 100),
    };
    setKeywords([...keywords, newKeyword]);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <TrendingUp className="mr-2 h-4 w-4 inline-block" />
              Used This Month
            </CardTitle>
            <Badge variant="secondary">{usedThisMonth}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {percentageUsed.toFixed(1)}%
            </div>
            <Progress value={percentageUsed} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              of total keywords
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Hash className="mr-2 h-4 w-4 inline-block" />
              Total Keywords
            </CardTitle>
            <Badge variant="secondary">{totalKeywords}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKeywords}</div>
            <p className="text-xs text-muted-foreground mt-2">
              keywords in database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <XCircle className="mr-2 h-4 w-4 inline-block" />
              Unused Keywords
            </CardTitle>
            <Badge variant="secondary">{totalKeywords - usedThisMonth}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                ((totalKeywords - usedThisMonth) / totalKeywords) *
                100
              ).toFixed(1)}
              %
            </div>
            <Progress
              value={((totalKeywords - usedThisMonth) / totalKeywords) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              of total keywords
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search keywords"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Button
          onClick={handleUpload}
          className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
        >
          {/* <Upload className="mr-2 h-4 w-4" /> */}
          Add Keywords
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.word}</TableCell>
                  <TableCell>
                    {keyword.used ? (
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="mr-1 h-3 w-3 inline" /> Used
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800"
                      >
                        <XCircle className="mr-1 h-3 w-3 inline" /> Unused
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{keyword.usageCount}</TableCell>
                  <TableCell>
                    {keyword.source === "user" ? (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-800"
                      >
                        <User className="mr-1 h-3 w-3 inline" /> User
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-[#4f46e5]/70 text-white hover:bg-indigo-300"
                      >
                        <Activity className="mr-1 h-3 w-3 inline" /> Pulser
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress value={keyword.score} className="w-16 mr-2" />
                      <span>{keyword.score}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
