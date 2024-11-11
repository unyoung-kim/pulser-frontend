"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Building2,
  ChevronRight,
  Globe,
  Lightbulb,
  MessageSquareText,
  Package,
  Sparkles,
  Tags,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Separator } from "../ui/separator";

export default function BackgroundForm2() {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    {
      id: "basic",
      icon: Building2,
      label: "Basic Information",
      required: true,
    },
    { id: "product", icon: Package, label: "Product Details" },
    { id: "audience", icon: Users, label: "Audience" },
    { id: "voice", icon: MessageSquareText, label: "Voice & Style" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Essential details about your company.
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Name & Company URL
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  defaultValue="https://wearetenet.com/"
                />
                <p className="text-sm text-muted-foreground">
                  Your company name and website URL.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  Industry Keywords
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g. UI/UX, Web Design, Digital Marketing"
                  defaultValue="UI/UX, Design Agency, Web Design, Growth Marketing, Brand Design, PPC Advertising"
                />
                <p className="text-sm text-muted-foreground">
                  Keywords that best describe your industry and business focus.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="function" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Company Function
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Textarea
                  id="function"
                  placeholder="Describe what your company does"
                  defaultValue="Global brands turn to tenet for simplified digital growth strategies. We improve revenue & deliver outcomes that matter, by combining UI UX design, development, and growth marketing."
                />
              </div>
            </CardContent>
          </Card>
        );

      case "product":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Tell us about your products and what makes them unique.
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="value" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Key Value Proposition
                </Label>
                <Textarea
                  id="value"
                  placeholder="What makes your offering unique?"
                  defaultValue="Global brands turn to tenet for simplified digital growth strategies. We improve revenue & deliver outcomes that matter, by combining UI UX design, development, and growth marketing."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products to Sell
                </Label>
                <Textarea
                  id="products"
                  placeholder="Maximum 3 products. Format: Name - Description (one per line)"
                  defaultValue="N/A"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum 3 products. Format: Name - Description (one per line)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advantage" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Competitive Advantage
                </Label>
                <Textarea
                  id="advantage"
                  placeholder="What sets you apart from competitors?"
                  defaultValue="N/A"
                />
                <p className="text-sm text-muted-foreground">
                  Optional, but helps us highlight your unique selling points
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "audience":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Target Audience</CardTitle>
                  <CardDescription>
                    Help us understand who your customers are and their needs.
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="painPoints" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Customer Pain Points
                </Label>
                <Textarea
                  id="painPoints"
                  placeholder="2-3 points that describe what problems your customers are trying to solve"
                  defaultValue="Difficulty doing good web design"
                />
                <p className="text-sm text-muted-foreground">
                  2-3 points that describe what problems your customers are
                  trying to solve
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customer Profile
                </Label>
                <Textarea
                  id="profile"
                  placeholder="Be specific about who makes the purchasing decisions"
                  defaultValue="N/A"
                />
                <p className="text-sm text-muted-foreground">
                  Be specific about who makes the purchasing decisions
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "voice":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Brand Voice</CardTitle>
                  <CardDescription>
                    Help us match your brand&apos;s tone and style.
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="style" className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4" />
                  Writing Style Reference
                </Label>
                <Textarea
                  id="style"
                  className="min-h-[200px]"
                  placeholder="Paste a few paragraphs from your existing content that exemplify your preferred writing style"
                />
                <p className="text-sm text-muted-foreground">
                  Paste a few paragraphs from your existing content that
                  exemplify your preferred writing style. This helps us match
                  your tone of voice.
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Background</h1>
          <p className="text-muted-foreground">
            Help us get to know your business to generate relevant articles. The
            more information you provide, the better content we can create for
            you.
          </p>
        </div>

        <Separator className="" />

        <div className="grid md:grid-cols-[240px_1fr] gap-6 mt-2">
          {/* Navigation Sidebar */}
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 w-full rounded-lg border p-3 text-left text-sm transition-colors bg-white hover:bg-accent",
                  activeTab === tab.id && "bg-accent"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.required && (
                  <span className="text-red-600  text-lg">*</span>
                )}
                {activeTab === tab.id && (
                  <ChevronRight className="h-5 w-5 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* Main Form Content */}
          <div className="space-y-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
