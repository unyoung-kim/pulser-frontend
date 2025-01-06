'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/lib/api/backend';
import { plans } from '@/lib/pricing-plan';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import Case from 'case';
import { AlertCircle, ExternalLink, Settings } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '../ui/badge';

interface Usage {
  credits_charged: number;
  additional_credits_charged: number;
  credits_used: number;
  plan: string;
  term: 'MONTHLY' | 'YEARLY';
}

export default function PricingPage() {
  const { orgId } = useAuth();
  const [activeTab, setActiveTab] = useState<'plan' | 'subscription' | 'danger'>('subscription');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { toast } = useToast();

  const previousPurchases = [
    { date: '-', credits: '-', amount: '-' },
    // Add more purchase history as needed
  ];

  const { data: usage, isPending: isLoadingUsage } = useQuery<Usage>({
    queryKey: ['usage', orgId],
    queryFn: async () => {
      if (!orgId) throw new Error('No organization ID found');

      // First, get the organization and its current_usage_id
      const { data: orgData, error: orgError } = await supabase
        .from('Organization')
        .select('current_usage_id')
        .eq('org_id', orgId)
        .single();

      if (orgError) {
        // If org doesn't exist, create new usage and org records
        if (orgError.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('Usage')
            .insert([
              {
                org_id: orgId,
                start_date: new Date().toISOString().split('T')[0],
                credits_used: 0,
                credits_charged: 0,
                additional_credits_charged: 0,
                plan: 'FREE_CREDIT',
                term: 'YEARLY',
                end_date: null,
              },
            ])
            .select()
            .single();

          if (insertError) throw insertError;

          return {
            credits_charged: newData?.credits_charged ?? 0,
            additional_credits_charged: newData?.additional_credits_charged ?? 0,
            credits_used: newData?.credits_used ?? 0,
            plan: newData?.plan ?? 'FREE_CREDIT',
            term: newData?.term ?? 'YEARLY',
          };
        }
        throw orgError;
      }

      // Then fetch the usage data using the current_usage_id
      const { data, error } = await supabase
        .from('Usage')
        .select('plan, credits_charged, additional_credits_charged, credits_used, term')
        .eq('id', orgData.current_usage_id)
        .single();

      if (error) throw error;

      setBillingCycle(data?.term?.toLowerCase() as 'monthly' | 'yearly');

      return {
        credits_charged: data?.credits_charged ?? 0,
        additional_credits_charged: data?.additional_credits_charged ?? 0,
        credits_used: data?.credits_used ?? 0,
        plan: data?.plan ?? 'FREE_CREDIT',
        term: data?.term ?? 'YEARLY',
      };
    },
    enabled: !!orgId,
  });

  useEffect(() => {
    if (usage?.plan && usage.plan !== 'FREE_CREDIT') {
      setActiveTab('plan');
    } else {
      setActiveTab('subscription');
    }
  }, [usage?.plan]);

  const totalCredits = usage ? usage.credits_charged + usage.additional_credits_charged : 0;
  const usedCredits = usage?.credits_used ?? 0;
  const remainingCredits = totalCredits - usedCredits;

  const handleChoosePlan = useCallback(
    async (planName: string) => {
      if (!orgId) {
        console.log('No orgId found');
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/create-stripe-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orgId: orgId,
            plan: planName as 'SOLO' | 'BUSINESS' | 'AGENCY',
            term: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
            mode: 'subscription',
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        window.location.href = data.data;
      } catch (error) {
        console.error('Error creating stripe session:', error);
      }
    },
    [orgId, billingCycle]
  );

  const handleUpdatePlan = useCallback(
    async (planName: string) => {
      if (!orgId) {
        console.log('No orgId found');
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/update-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orgId: orgId,
            plan: planName as 'BASIC' | 'PRO' | 'AGENCY',
            term: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
          }),
        });

        const data = await response.json();

        if (!data.success) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: data.error || 'Failed to update subscription',
          });
          return;
        }

        toast({
          title: 'Success',
          description: 'Your subscription has been updated successfully',
        });

        window.location.reload();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update subscription. Please try again later.',
        });
        console.error('Error updating subscription:', error);
      }
    },
    [orgId, billingCycle, toast]
  );

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (orgId: string) => {
      const response = await fetch(`${BACKEND_URL}/api/delete-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orgId }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your subscription has been cancelled successfully',
      });
      window.location.reload();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel subscription',
      });
    },
  });

  const handleCancelSubscription = async () => {
    if (!orgId) {
      console.log('No orgId found');
      return;
    }
    cancelSubscriptionMutation.mutate(orgId);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your subscription and billing details.</p>
        </div>

        {/* <Separator className="" /> */}

        <div className="flex gap-8 border-b mb-8">
          <button
            onClick={() => setActiveTab('plan')}
            className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
              activeTab === 'plan' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Plan
            {activeTab === 'plan' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
              activeTab === 'subscription' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Subscription
            {activeTab === 'subscription' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
              activeTab === 'danger' ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            Danger
            {activeTab === 'danger' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-destructive" />
            )}
          </button>
        </div>

        {activeTab === 'plan' ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base text-muted-foreground font-normal">Credits left</h3>
                  <Badge
                    variant="secondary"
                    className="text-sm font-medium capitalize bg-secondary/100 text-secondary-foreground"
                  >
                    {Case.capital(usage?.plan ?? '')}
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <p className="text-5xl font-semibold">
                    {remainingCredits}
                    <span className="text-2xl text-muted-foreground font-normal ml-2">
                      /{totalCredits}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">Renews on Jan 1, 2025</p>
                </div>
                {/* Add subscription info section */}
                {usage?.plan && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Current Subscription</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {Case.capital(usage.plan)} Plan ({Case.capital(usage.term.toLowerCase())})
                        </p>
                      </div>
                      <Button
                        variant="link"
                        className="text-indigo-600 p-0 h-auto font-semibold"
                        onClick={() => setActiveTab('subscription')}
                      >
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Previous Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {previousPurchases.map((purchase, index) => (
                    <li
                      key={index}
                      className="flex justify-between text-sm py-2 border-b last:border-b-0"
                    >
                      <span>{purchase.date}</span>
                      <span>{purchase.credits === '-' ? '-' : `${purchase.credits} credits`}</span>
                      <span className="font-medium">
                        {purchase.amount === '-' ? '-' : `$${purchase.amount}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'subscription' ? (
          <>
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    billingCycle === 'monthly' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    billingCycle === 'yearly' ? 'bg-background shadow-sm' : 'text-muted-foreground'
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
                    usage?.plan === plan.name.toUpperCase() &&
                    usage?.plan !== 'FREE_CREDIT' &&
                    usage?.term.toLowerCase() === billingCycle
                      ? 'border-indigo-600 shadow-md'
                      : ''
                  }`}
                >
                  {plan.popular && usage?.plan === 'FREE_CREDIT' && (
                    <span className="absolute right-4 top-4 bg-indigo-600 text-white text-sm px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  {(() => {
                    const isCurrentPlan =
                      usage?.plan === plan.name.toUpperCase() &&
                      usage?.plan !== 'FREE_CREDIT' &&
                      usage?.term.toLowerCase() === billingCycle;

                    return isCurrentPlan ? (
                      <span className="absolute right-4 top-4 bg-indigo-600 text-white text-sm px-3 py-1 rounded-full">
                        Current Plan
                      </span>
                    ) : null;
                  })()}
                  <CardContent className="pt-6 pb-8 px-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <plan.icon className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                          ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground">USD / mo</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Billed yearly</div>
                    </div>

                    {!(
                      usage?.plan === plan.name.toUpperCase() &&
                      usage?.plan !== 'FREE_CREDIT' &&
                      usage?.term.toLowerCase() === billingCycle
                    ) && (
                      <Button
                        variant={
                          usage?.plan !== 'FREE_CREDIT'
                            ? 'default'
                            : plan.popular
                              ? 'default'
                              : 'outline'
                        }
                        className={`w-full mb-6 ${usage?.plan !== 'FREE_CREDIT' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                        onClick={() =>
                          usage?.plan !== 'FREE_CREDIT'
                            ? handleUpdatePlan(plan.name.toUpperCase())
                            : handleChoosePlan(plan.name.toUpperCase())
                        }
                      >
                        Choose Plan
                      </Button>
                    )}

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
        ) : (
          activeTab === 'danger' && (
            <Card className="border-destructive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-destructive mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold">Cancel Subscription</h3>
                      {usage?.plan === 'FREE_CREDIT' ? (
                        <p className="text-muted-foreground">
                          You don&apos;t have any active subscription to cancel.
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          This action cannot be undone. Your subscription will be cancelled
                          immediately.
                        </p>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={usage?.plan === 'FREE_CREDIT'}>
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to cancel your subscription?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. You will lose access to your current plan
                          benefits.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscriptionMutation.isPending}
                        >
                          {cancelSubscriptionMutation.isPending
                            ? 'Cancelling...'
                            : 'Yes, Cancel Subscription'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {activeTab !== 'danger' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <Settings className="w-8 h-8 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Need a Custom Plan?</h3>
                    <p className="text-muted-foreground">
                      Have specific needs or special requests? Contact us for a tailored solution.
                    </p>
                  </div>
                </div>
                <Button variant="outline">Get a Quote</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
