"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/lib/pricing-plan";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Settings } from "lucide-react";
import { useState } from "react";

interface Usage {
  credits_charged: number;
  additional_credits_charged: number;
  credits_used: number;
}

export default function PricingPage() {
  const { orgId } = useAuth();
  const [activeTab, setActiveTab] = useState<"plan" | "subscription">(
    "subscription"
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly"
  );

  const previousPurchases = [
    { date: "-", credits: "-", amount: "-" },
    // Add more purchase history as needed
  ];

  const { data: usage, isLoading: isLoadingUsage } = useQuery<Usage>({
    queryKey: ["usage", orgId],
    queryFn: async () => {
      if (!orgId) throw new Error("No organization ID found");

      const { data, error } = await supabase
        .from("Usage")
        .select("credits_charged, additional_credits_charged, credits_used")
        .eq("org_id", orgId)
        .is("end_date", null)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          const { data: newData, error: insertError } = await supabase
            .from("Usage")
            .insert([
              {
                org_id: orgId,
                start_date: new Date().toISOString().split("T")[0],
                credits_used: 0,
                credits_charged: 0,
                additional_credits_charged: 0,
                end_date: null,
              },
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          return {
            credits_charged: newData?.credits_charged || 0,
            additional_credits_charged:
              newData?.additional_credits_charged || 0,
            credits_used: newData?.credits_used || 0,
          };
        }
        throw error;
      }

      return {
        credits_charged: data.credits_charged || 0,
        additional_credits_charged: data.additional_credits_charged || 0,
        credits_used: data.credits_used || 0,
      };
    },
    enabled: !!orgId,
  });

  const totalCredits = usage
    ? usage.credits_charged + usage.additional_credits_charged
    : 0;
  const usedCredits = usage?.credits_used || 0;
  const remainingCredits = totalCredits - usedCredits;

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing details.
          </p>
        </div>

        {/* <Separator className="" /> */}

        <div className="flex gap-8 border-b mb-8">
          <button
            onClick={() => setActiveTab("plan")}
            className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
              activeTab === "plan" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Plan
            {activeTab === "plan" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
              activeTab === "subscription"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Subscription
            {activeTab === "subscription" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {activeTab === "plan" ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-base text-muted-foreground font-normal mb-4">
                  Credits left
                </h3>
                <div className="flex justify-between items-baseline mb-4">
                  <p className="text-5xl font-semibold">{remainingCredits}</p>
                  <p className="text-sm text-muted-foreground">
                    Renews on Jan 1, 2025
                  </p>
                </div>
                <Button
                  variant="link"
                  className="text-indigo-600 p-0 h-auto font-semibold"
                >
                  Buy Credits
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Previous Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {previousPurchases.map((purchase, index) => (
                    <li
                      key={index}
                      className="flex justify-between text-sm py-2 border-b last:border-b-0"
                    >
                      <span>{purchase.date}</span>
                      <span>
                        {purchase.credits === "-"
                          ? "-"
                          : `${purchase.credits} credits`}
                      </span>
                      <span className="font-medium">
                        {purchase.amount === "-" ? "-" : `$${purchase.amount}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    billingCycle === "monthly"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    billingCycle === "yearly"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Yearly
                  <span className="text-xs text-indigo-600">(Save 40%)</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular ? "border-indigo-600 shadow-md" : ""
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute right-4 top-4 bg-indigo-600 text-white text-sm px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <CardContent className="pt-6 pb-8 px-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <plan.icon className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                          $
                          {billingCycle === "yearly"
                            ? plan.yearlyPrice
                            : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground">USD / mo</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed yearly
                      </div>
                    </div>

                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full mb-6 "
                    >
                      Choose Plan
                    </Button>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-indigo-600/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      </div>
                      {plan.credits} credits per month
                    </div>

                    <Button variant="link" className="mt-6 w-full">
                      See Plan Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <Settings className="w-8 h-8 text-indigo-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Need a Custom Plan?
                  </h3>
                  <p className="text-muted-foreground">
                    Have specific needs or special requests? Contact us for a
                    tailored solution.
                  </p>
                </div>
              </div>
              <Button variant="outline">Get a Quote</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
