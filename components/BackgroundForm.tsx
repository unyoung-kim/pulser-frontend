import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle,
  Loader2,
  MessageSquareText,
  Package2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BackgroundSchema = z.object({
  basic: z.object({
    nameAndCompanyUrl: z.string().nonempty("Name & Company URL is required"),
    industryKeywords: z
      .string()
      .nonempty("At least one industry/keyword is required"),
  }),
  product: z.object({
    companyFunction: z.string().nonempty("Company function is required"),
    valueProposition: z.string().nonempty("Key value proposition is required"),
    productsToSell: z.string().nonempty("At least one product is required"),
    competitiveAdvantage: z.string().optional(),
    companyMission: z.string().optional(),
  }),
  audience: z.object({
    customerStruggles: z
      .string()
      .nonempty("At least 2 customer struggles are required"),
    customerDescription: z
      .string()
      .nonempty("Customer description is required"),
  }),
  voice: z.object({
    writingStyle: z.string().optional(),
  }),
});

type Background = z.infer<typeof BackgroundSchema>;

interface BackgroundFormProps {
  projectId?: string;
  onSubmit?: (data: Background) => Promise<void>;
  loading?: boolean;
}

export function BackgroundForm({
  projectId,
  onSubmit,
  loading: externalLoading,
}: BackgroundFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<Background>({
    resolver: zodResolver(BackgroundSchema),
    defaultValues: {
      basic: { nameAndCompanyUrl: "", industryKeywords: "" },
      product: {
        companyFunction: "",
        valueProposition: "",
        productsToSell: "",
        competitiveAdvantage: "",
        companyMission: "",
      },
      audience: { customerStruggles: "", customerDescription: "" },
      voice: { writingStyle: "" },
    },
  });

  // Load saved data when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        let savedData: Background | null = null;

        // Try to load from localStorage first
        const localData = localStorage.getItem("backgroundInfo");
        if (localData) {
          savedData = JSON.parse(localData);
        }

        // If we have projectId and no local data, we could fetch from API here
        if (projectId && !savedData) {
          const response = await fetch(`/api/background/${projectId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch data from API");
          }
          savedData = await response.json();
        }

        // If we found saved data, update the form
        if (savedData) {
          form.reset(savedData);
          toast({
            title: "Data Loaded",
            description: "Your previously saved information has been restored.",
            variant: "default",
          });
        }
      } catch (error: unknown) {
        console.error("Error loading saved data:", error);
        toast({
          title: "Warning",
          description: "Could not load your previously saved information.",
          variant: "destructive",
        });
      }
    };

    loadSavedData();
  }, [form, projectId, toast]);

  const handleSubmit = async (data: Background) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Simulate API delay for localStorage
        await new Promise((resolve) => setTimeout(resolve, 500));
        localStorage.setItem("backgroundInfo", JSON.stringify(data));
      }

      toast({
        title: "Success!",
        description: "Your background information has been saved successfully.",
        variant: "default",
      });
    } catch (error: unknown) {
      console.error("Failed to save:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to save background information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion percentages
  const calculateProgress = () => {
    const formValues = form.getValues();

    // Helper function to check if a field has value
    const hasValue = (value: string | undefined): boolean => {
      return Boolean(value && value.trim() !== "");
    };

    // Required fields
    const requiredFields = [
      {
        path: "basic.nameAndCompanyUrl",
        value: formValues.basic.nameAndCompanyUrl,
      },
      {
        path: "basic.industryKeywords",
        value: formValues.basic.industryKeywords,
      },
      {
        path: "product.companyFunction",
        value: formValues.product.companyFunction,
      },
      {
        path: "product.valueProposition",
        value: formValues.product.valueProposition,
      },
      {
        path: "product.productsToSell",
        value: formValues.product.productsToSell,
      },
      {
        path: "audience.customerStruggles",
        value: formValues.audience.customerStruggles,
      },
      {
        path: "audience.customerDescription",
        value: formValues.audience.customerDescription,
      },
    ];

    // All fields (including optional)
    const allFields = [
      ...requiredFields,
      {
        path: "product.competitiveAdvantage",
        value: formValues.product.competitiveAdvantage,
      },
      {
        path: "product.companyMission",
        value: formValues.product.companyMission,
      },
      { path: "voice.writingStyle", value: formValues.voice.writingStyle },
    ];

    const filledRequired = requiredFields.filter((field) =>
      hasValue(field.value)
    ).length;
    const filledTotal = allFields.filter((field) =>
      hasValue(field.value)
    ).length;

    return {
      required: Math.round((filledRequired / requiredFields.length) * 100),
      total: Math.round((filledTotal / allFields.length) * 100),
    };
  };

  const progress = calculateProgress();

  // Update the Button component in each tab section:
  const SaveButton = () => (
    <Button
      type="submit"
      onClick={form.handleSubmit(handleSubmit)}
      disabled={loading || externalLoading}
      className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full text-sm min-w-[100px]"
      size="sm"
    >
      {loading || externalLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Info
        </>
      )}
    </Button>
  );

  return (
    <>
      <div className="flex justify-between items-start gap-8">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Background</h2>
          <p className="text-sm text-muted-foreground max-w-[450px]">
            Help us get to know your business to generate relevant articles. The
            more information you provide, the better content we can create for
            you.
          </p>
        </div>

        <div className="min-w-[200px]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-sm text-gray-600">Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-200"></div>
                <span className="text-sm text-gray-600">Optional</span>
              </div>
            </div>
            <span className="text-sm font-medium">{progress.required}%</span>
          </div>

          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress.required}%` }}
            />
            <div
              className="absolute left-0 top-0 h-full bg-indigo-200 transition-all duration-300"
              style={{ width: `${progress.total}%` }}
            />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="basic" className="w-full">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
              <TabsTrigger
                value="basic"
                className="w-full justify-start px-4 py-2 font-normal"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Basic Information
              </TabsTrigger>
              <TabsTrigger
                value="product"
                className="w-full justify-start px-4 py-2 font-normal"
              >
                <Package2 className="w-4 h-4 mr-2" />
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="audience"
                className="w-full justify-start px-4 py-2 font-normal"
              >
                <Users className="w-4 h-4 mr-2" />
                Audience
              </TabsTrigger>
              <TabsTrigger
                value="voice"
                className="w-full justify-start px-4 py-2 font-normal"
              >
                <MessageSquareText className="w-4 h-4 mr-2" />
                Voice & Style
              </TabsTrigger>
            </TabsList>
          </aside>

          <div className="flex-1 lg:max-w-2xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <TabsContent value="basic">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">
                          Basic Information
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Essential details about your company.
                        </p>
                      </div>
                      <SaveButton />
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="basic.nameAndCompanyUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name & Company URL *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe - www.example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your company name and website URL.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basic.industryKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry Keywords *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., Technology, SaaS, B2B"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Keywords that best describe your industry and
                            business focus.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="product">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Product Details</h3>
                        <p className="text-sm text-muted-foreground">
                          Tell us about your products and what makes them
                          unique.
                        </p>
                      </div>
                      <SaveButton />
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="product.companyFunction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Function *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What does your company do/sell? Be specific about your main products or services."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product.valueProposition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Value Proposition *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What unique value do you provide to your customers? What problems do you solve?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product.productsToSell"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Products to Sell *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List up to 3 products in this format:&#10;Product Name - Brief description of the product&#10;Example:&#10;Premium Plan - Full access to all features with priority support"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum 3 products. Format: Name - Description (one
                            per line)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product.competitiveAdvantage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competitive Advantage</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What makes your product different from competitors? What unique features or benefits do you offer?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional, but helps us highlight your unique selling
                            points
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="audience">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Target Audience</h3>
                        <p className="text-sm text-muted-foreground">
                          Help us understand who your customers are and their
                          needs.
                        </p>
                      </div>
                      <SaveButton />
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="audience.customerStruggles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Pain Points *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List 2-3 key challenges your customers face (one per line)&#10;Example:&#10;1. Difficulty managing remote teams effectively&#10;2. Lack of visibility into project progress&#10;3. Communication gaps between departments"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            2-3 points that describe what problems your
                            customers are trying to solve
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="audience.customerDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Profile *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your target customer (age, gender, job title, etc.)&#10;Example: Working mothers aged 30-45 who make purchasing decisions for their children's fitness activities"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific about who makes the purchasing decisions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="voice">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Brand Voice</h3>
                        <p className="text-sm text-muted-foreground">
                          Help us match your brand&apos;s tone and style.
                        </p>
                      </div>
                      <SaveButton />
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="voice.writingStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Writing Style Reference</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste a few paragraphs from your existing content that exemplify your preferred writing style. This helps us match your tone of voice."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional: Provide examples of your existing content
                            to help us match your voice
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </form>
            </Form>
          </div>
        </div>
      </Tabs>
    </>
  );
}
