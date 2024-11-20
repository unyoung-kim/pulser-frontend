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
import { Textarea } from "@/components/ui/textarea2";
import { cn } from "@/lib/utils";
import {
  Building2,
  Check,
  ChevronRight,
  FileText,
  Globe,
  Lightbulb,
  Link as LinkIcon,
  MessageSquare,
  Package,
  Sparkles,
  Star,
  Tags,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { getPathFromURL } from "@/lib/url";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const BackgroundSchema2 = z.object({
  basic: z.object({
    companyUrl: z.string().nullish(),
    industryKeywords: z.string().nullish(),
    companyFunction: z.string().nullish(),
    additionalInfo: z.record(z.string()).optional(),
  }),
  product: z.object({
    valueProposition: z.string().nullish(),
    products: z.string().nullish(),
    competitiveAdvantage: z.string().nullish(),
    additionalInfo: z.record(z.string()).optional(),
  }),
  audience: z.object({
    painPoints: z.string().nullish(),
    customerProfile: z.string().nullish(),
    additionalInfo: z.record(z.string()).optional(),
  }),
  socialProof: z.object({
    testimonials: z.string().nullish(),
    caseStudies: z.string().nullish(),
    achievements: z.string().nullish(),
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
    socialProof: { testimonials: "", caseStudies: "", achievements: "" },
  });
  const [domain, setDomain] = useState("");
  const [isValidDomain, setIsValidDomain] = useState(false);

  const tabs = [
    {
      id: "basic",
      icon: Building2,
      label: "Basic Information",
      required: true,
    },
    { id: "product", icon: Package, label: "Product Details" },
    { id: "audience", icon: Users, label: "Audience" },
    { id: "socialProof", icon: Star, label: "Social Proof" },
    { id: "internalLinks", icon: Globe, label: "Internal Links" },
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

  const { data: internalLinks, isLoading: isLoadingLinks } = useQuery({
    queryKey: ["internalLinks", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("InternalLink")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
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
        socialProof: {
          testimonials: project.background.socialProof?.testimonials || "",
          caseStudies: project.background.socialProof?.caseStudies || "",
          achievements: project.background.socialProof?.achievements || "",
        },
      });
    }
  }, [project]);

  useEffect(() => {
    if (formData.basic.companyUrl) {
      setDomain(formData.basic.companyUrl);
      setIsValidDomain(validateDomain(formData.basic.companyUrl));
    }
  }, [formData.basic.companyUrl]);

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
        icon: <Check className="h-6 w-6 text-green-500" />,
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

  const validateDomain = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
      const urlObject = new URL(url);
      return urlObject.protocol === "http:" || urlObject.protocol === "https:";
    } catch {
      return false;
    }
  };

  const { mutate: findInternalLinks, isLoading: isFindingLinks } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://pulser-backend.onrender.com/api/internal-links-handler",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        }
      );
      if (!response.ok) throw new Error("Failed to find internal links");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["internalLinks", projectId]);
      toast({
        title: "Success",
        description: "Internal links found successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to find internal links",
        variant: "destructive",
      });
    },
  });

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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (validateDomain(value) || value === "") {
                      handleInputChange("basic", "companyUrl", value);
                    }
                  }}
                  className={
                    !validateDomain(formData.basic.companyUrl) &&
                    formData.basic.companyUrl
                      ? "border-red-500"
                      : ""
                  }
                />
                {formData.basic.companyUrl &&
                  !validateDomain(formData.basic.companyUrl) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid URL (e.g., https://example.com)
                    </p>
                  )}
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
                  placeholder="Maximum 3 products. Format: Name - Description"
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

      case "socialProof":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Social Proof</CardTitle>
                  <CardDescription>
                    We will naturally embed these into your articles for
                    credibility.
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
                <Label
                  htmlFor="testimonials"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-semibold">Customer Testimonials</span>
                </Label>
                <Textarea
                  id="testimonials"
                  placeholder="Add key customer testimonials"
                  value={formData.socialProof?.testimonials || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "socialProof",
                      "testimonials",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="caseStudies"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span className="font-semibold">Case Studies</span>
                </Label>
                <Textarea
                  id="caseStudies"
                  placeholder="Summarize your best case studies"
                  value={formData.socialProof?.caseStudies || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "socialProof",
                      "caseStudies",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="achievements"
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold">Key Achievements</span>
                </Label>
                <Textarea
                  id="achievements"
                  placeholder="List notable awards, statistics, or milestones"
                  value={formData.socialProof?.achievements || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "socialProof",
                      "achievements",
                      e.target.value
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        );

      case "internalLinks":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Internal Links</CardTitle>
                  <CardDescription>
                    Specify your website domain for internal linking.
                  </CardDescription>
                </div>
                <Button
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => findInternalLinks()}
                  disabled={!isValidDomain || isFindingLinks}
                >
                  {isFindingLinks ? (
                    "Finding Links..."
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Find Internal Links
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="domain" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Domain</span>
                </Label>
                <Input
                  id="domain"
                  placeholder="https://example.com"
                  value={domain}
                  disabled={true}
                  className={!isValidDomain && domain ? "border-red-500" : ""}
                />
                {!domain && (
                  <p className="text-sm text-muted-foreground">
                    Domain will be automatically loaded from Basic Information{" "}
                    {">"} Company URL.
                  </p>
                )}
                {domain && !isValidDomain && (
                  <p className="text-sm text-red-500">
                    Please enter a valid domain (e.g., https://example.com)
                  </p>
                )}
                {/* <p className="text-sm text-muted-foreground">
                  Enter your website&apos;s domain for internal linking
                  purposes.
                </p> */}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Found Internal Links</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  These links will be strategically incorporated into your
                  generated articles to improve internal linking and SEO
                  performance of your website.
                </p>
                <div className="border rounded-lg">
                  {isLoadingLinks ? (
                    <p className="p-4">Loading links...</p>
                  ) : !internalLinks?.length ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      No internal links found yet. Click &quot;Find Internal
                      Links&quot; to scan your website.
                    </p>
                  ) : (
                    <div className="divide-y">
                      {internalLinks.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-start gap-3 p-4"
                        >
                          <LinkIcon className="h-4 w-4 flex-shrink-0 mt-1" />
                          <div className="flex flex-col flex-1 justify-center">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-bold hover:underline break-all"
                            >
                              {getPathFromURL(link.url)}
                            </a>
                            {link.summary && (
                              <span className="text-xs text-muted-foreground break-words">
                                {link.summary}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
