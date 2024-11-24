"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "../ui/separator";

export default function SettingsMain() {
  const { orgId } = useAuth();

  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Organization")
        .select("*")
        .eq("org_id", orgId as string)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orgId, // Only run query when orgId is available
  });

  const {
    data: usage,
    isLoading: usageLoading,
    error: usageError,
  } = useQuery({
    queryKey: ["usage", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Usage")
        .select("*")
        .eq("id", organization?.current_usage_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });

  //   if (isLoading) return <div>Loading...</div>;
  //   if (error) return <div>Error loading organization data</div>;

  //   if (usageLoading) return <div>Loading...</div>;
  //   if (usageError) return <div>Error loading usage data</div>;

  return (
    <div className="">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Plan</h1>
        <p className="text-muted-foreground mt-1">
          Manage your plan and billing details.
        </p>
      </div>
      <Separator className="mt-5" />

      <div className="space-y-8 mt-8">
        {/* Plan Details */}
        <section>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-bold text-gray-900">Pro</h3>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-sm px-3 py-1"
                  >
                    Trialing
                  </Badge>
                </div>
                <Button variant="outline">Edit payment details</Button>
              </div>
              <p className="text-sm text-gray-600">
                New monthly Pro subscription begins {usage?.end_date ?? "-"}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Plan Usage */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Plan limits usage
          </h2>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Blog Posts Created
              </CardTitle>
              <span className="text-md text-muted-foreground">
                {usage?.credits_used} / {usage?.credits_charged}
              </span>
            </CardHeader>
            <CardContent>
              <Progress
                value={
                  (usage?.credits_used / usage?.credits_charged) * 100 || 0
                }
                className="h-3"
              />
              <p className="mt-2 text-sm text-gray-600">
                {(usage?.credits_used / usage?.credits_charged) * 100}% of your
                monthly credits used
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Explore Plans */}
        {/* <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Explore our plans</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm">Monthly</span>
              <Switch />
              <span className="text-sm">Annually</span>
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-600"
              >
                Save more than 20% 🎉
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">Pro</h3>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  For expert features and small teams
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">$138</span>
                  <span className="text-muted-foreground">/month</span>
                  <p className="text-sm text-muted-foreground">$1,656/year</p>
                </div>
                <div className="space-y-4">
                  <p className="text-sm">
                    Advanced AI features to create content for multiple brands &
                    collaborate on campaigns.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "1 seat, add up to 5",
                      "3 Brand Voices",
                      "10 Knowledge assets",
                      "3 Instant Campaigns",
                      "Collaboration & user management",
                      "AI image generation & editing tools",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="mb-2">
                  <h3 className="text-xl font-semibold">Business</h3>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">Let&apos;s talk</span>
                </div>
                <p className="text-sm mb-6">
                  Personalized AI features with additional control, security,
                  team training & tech support.
                </p>
                <ul className="space-y-3">
                  {[
                    "Unlimited feature usage",
                    "Groups & document collaboration",
                    "Performance Analytics & Insights",
                    "Custom Style Guides with X-ray view",
                    "Enterprise-grade security & governance",
                    "Advanced admin panel with permissions",
                    "Custom workflows & templates*",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section> */}
      </div>
    </div>
  );
}
