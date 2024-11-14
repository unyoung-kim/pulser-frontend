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
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const BackgroundSchema2 = z.object({
  basic: z.object({
    companyUrl: z.string().nullish(),
    industryKeywords: z.string().nullish(),
    companyFunction: z.string().nullish(),
    // Future fields can be added here
    additionalInfo: z.record(z.string()).optional(),
  }),
  product: z.object({
    valueProposition: z.string().nullish(),
    products: z.string().nullish(),
    competitiveAdvantage: z.string().nullish(),
    // Future fields can be added here
    additionalInfo: z.record(z.string()).optional(),
  }),
  audience: z.object({
    painPoints: z.string().nullish(),
    customerProfile: z.string().nullish(),
    // Future fields can be added here
    additionalInfo: z.record(z.string()).optional(),
  }),
  voice: z.object({
    writingStyle: z.string().nullish(),
    // Future fields can be added here
    additionalInfo: z.record(z.string()).optional(),
  }),
});

export default function BackgroundForm2({ projectId }: { projectId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<z.infer<typeof BackgroundSchema2>>({
    basic: { companyUrl: "", industryKeywords: "", companyFunction: "" },
    product: { valueProposition: "", products: "", competitiveAdvantage: "" },
    audience: { painPoints: "", customerProfile: "" },
    voice: { writingStyle: "" },
  });

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

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Project")
        .select("background")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (project?.background) {
      setFormData({
        basic: {
          companyUrl: project.background.basic?.companyUrl || "",
          industryKeywords: project.background.basic?.industryKeywords || "",
          companyFunction: project.background.basic?.companyFunction || "",
        },
        product: {
          valueProposition: project.background.product?.valueProposition || "",
          products: project.background.product?.products || "",
          competitiveAdvantage:
            project.background.product?.competitiveAdvantage || "",
        },
        audience: {
          painPoints: project.background.audience?.painPoints || "",
          customerProfile: project.background.audience?.customerProfile || "",
        },
        voice: {
          writingStyle: project.background.voice?.writingStyle || "",
        },
      });
    }
  }, [project]);

  const handleInputChange = (
    section: keyof typeof formData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const { mutate: updateBackground } = useMutation({
    mutationFn: async (newData: Partial<z.infer<typeof BackgroundSchema2>>) => {
      const updatedBackground = {
        ...(project?.background || {}),
        [activeTab]: {
          ...(project?.background?.[activeTab as keyof typeof formData] || {}),
          ...newData[activeTab as keyof typeof formData],
        },
      };

      const { error } = await supabase
        .from("Project")
        .update({ background: updatedBackground })
        .eq("id", projectId);

      if (error) throw error;
      return updatedBackground;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast({
        title: "Success",
        description: "Background information saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save background information",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleSave = () => {
    updateBackground({
      [activeTab]: formData[activeTab as keyof typeof formData],
    });
  };

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
                <Button
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Company URL</span>
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={formData.basic.companyUrl || ""}
                  onChange={(e) =>
                    handleInputChange("basic", "companyUrl", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Your company name and website URL.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  <span className="font-semibold">Industry Keywords</span>
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g. UI/UX, Web Design, Digital Marketing"
                  value={formData.basic.industryKeywords || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "basic",
                      "industryKeywords",
                      e.target.value
                    )
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Keywords that best describe your industry and business focus.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="function" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">Company Function</span>
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Textarea
                  id="function"
                  placeholder="Describe what your company does"
                  value={formData.basic.companyFunction || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "basic",
                      "companyFunction",
                      e.target.value
                    )
                  }
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
                <Button
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="value" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-semibold">Key Value Proposition</span>
                </Label>
                <Textarea
                  id="value"
                  placeholder="What makes your offering unique?"
                  value={formData.product.valueProposition || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "product",
                      "valueProposition",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-semibold">Products to Sell</span>
                </Label>
                <Textarea
                  id="products"
                  placeholder="Maximum 3 products. Format: Name - Description (one per line)"
                  value={formData.product.products || ""}
                  onChange={(e) =>
                    handleInputChange("product", "products", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Maximum 3 products. Format: Name - Description (one per line)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advantage" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">Competitive Advantage</span>
                </Label>
                <Textarea
                  id="advantage"
                  placeholder="What sets you apart from competitors?"
                  value={formData.product.competitiveAdvantage || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "product",
                      "competitiveAdvantage",
                      e.target.value
                    )
                  }
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
                <Button
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="painPoints" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">Customer Pain Points</span>
                </Label>
                <Textarea
                  id="painPoints"
                  placeholder="2-3 points that describe what problems your customers are trying to solve"
                  value={formData.audience.painPoints || ""}
                  onChange={(e) =>
                    handleInputChange("audience", "painPoints", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  2-3 points that describe what problems your customers are
                  trying to solve
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">Customer Profile</span>
                </Label>
                <Textarea
                  id="profile"
                  placeholder="Be specific about who makes the purchasing decisions"
                  value={formData.audience.customerProfile || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "audience",
                      "customerProfile",
                      e.target.value
                    )
                  }
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
                <Button
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="style" className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4" />
                  <span className="font-semibold">Writing Style Reference</span>
                </Label>
                <Textarea
                  id="style"
                  className="min-h-[200px]"
                  placeholder="Paste a few paragraphs from your existing content that exemplify your preferred writing style"
                  value={formData.voice.writingStyle || ""}
                  onChange={(e) =>
                    handleInputChange("voice", "writingStyle", e.target.value)
                  }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
