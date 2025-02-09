'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Case from 'case';
import { AlertCircle, Settings } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateSubscription } from '@/lib/apiHooks/settings/useCreateSubscription';
import { useGetUsage } from '@/lib/apiHooks/settings/useGetUsage';
import { useSubscriptionCancel } from '@/lib/apiHooks/settings/useSubscriptionCancel';
import { useUpdateSubscription } from '@/lib/apiHooks/settings/useUpdateSubscription';
import { getPlanAction, planCards } from '@/lib/pricing-plan';
import { Badge } from '../ui/badge';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'subscription'>('subscription');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const { orgId } = useAuth();

  const { data: usage, isLoading, isSuccess } = useGetUsage(orgId);
  const createSubscriptionMutation = useCreateSubscription();
  const updateSubscriptionMutation = useUpdateSubscription();
  const cancelSubscriptionMutation = useSubscriptionCancel();

  useEffect(() => {
    if (usage?.plan && usage.plan !== 'FREE_CREDIT') {
      setActiveTab('plan');
    } else {
      setActiveTab('subscription');
    }
  }, [usage?.plan]);

  useEffect(() => {
    setBillingCycle(usage?.term?.toLowerCase() as 'monthly' | 'yearly');
  }, [usage?.term]);

  console.log('usage', usage);

  const totalCredits = usage ? usage.credits_charged + usage.additional_credits_charged : 0;
  const usedCredits = usage?.credits_used ?? 0;
  const remainingCredits = totalCredits - usedCredits;

  const handleChoosePlan = useCallback(
    (planName: string) => {
      if (!orgId) {
        return;
      }
      createSubscriptionMutation.mutate({
        orgId: orgId,
        newPlan: planName as 'BASIC' | 'PRO' | 'AGENCY',
        planTerm: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
        mode: 'subscription',
      });
    },
    [orgId, billingCycle, createSubscriptionMutation]
  );

  const handleUpdatePlan = useCallback(
    (planName: string) => {
      if (!orgId) {
        return;
      }
      updateSubscriptionMutation.mutate({
        orgId: orgId,
        newPlan: planName as 'BASIC' | 'PRO' | 'AGENCY',
        planTerm: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
      });
    },
    [orgId, billingCycle, updateSubscriptionMutation]
  );

  const handleCancelSubscription = () => {
    if (!orgId) {
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

        <div className="mb-8 flex gap-8 border-b">
          <button
            onClick={() => setActiveTab('plan')}
            className={`relative px-1 pb-4 text-sm font-semibold transition-colors ${
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
            className={`relative px-1 pb-4 text-sm font-semibold transition-colors ${
              activeTab === 'subscription' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Subscription
            {activeTab === 'subscription' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {activeTab === 'plan' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-normal text-muted-foreground">Credits left</h3>
                  <Badge
                    variant="secondary"
                    className="bg-secondary/100 text-sm font-medium capitalize text-secondary-foreground"
                  >
                    {usage?.is_cancelled ? 'Cancelled' : Case.capital(usage?.plan ?? '')}
                  </Badge>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-5xl font-semibold">
                    {remainingCredits}
                    <span className="ml-2 text-2xl font-normal text-muted-foreground">
                      /{totalCredits}
                    </span>
                  </p>
                  {usage?.plan !== 'FREE_CREDIT' && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Renews on {usage?.end_date}</p>
                      <p className="text-sm text-muted-foreground">
                        {usage?.is_cancelled
                          ? 'Credits available until your next renewal'
                          : 'Credits available until your plan ends'}
                      </p>
                    </div>
                  )}
                </div>
                {/* Add subscription info section */}
                {isSuccess && usage?.plan !== 'FREE_CREDIT' && (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Current Subscription</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {Case.capital(usage.plan)} Plan{' '}
                          {Case.capital(`(${usage.term.toLowerCase()})`)}
                          {usage.is_cancelled && ' - Cancelled'}
                        </p>
                      </div>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-semibold text-indigo-600"
                        onClick={() => setActiveTab('subscription')}
                      >
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {usage?.plan !== 'FREE_CREDIT' && !usage?.is_cancelled && (
              <Card className="border-destructive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="mt-1 h-8 w-8 text-destructive" />
                      <div>
                        <h3 className="text-lg font-semibold">Cancel Subscription</h3>
                        <p className="text-muted-foreground">
                          This action cannot be undone. Your subscription will be cancelled at the
                          end of the current billing period.
                        </p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Cancel Subscription</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be able to use your credits until the next billing date, after
                            plan cancellation.
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
            )}
          </div>
        )}
        {activeTab === 'subscription' && (
          <>
            <div className="mb-12 flex justify-center">
              <div className="inline-flex items-center rounded-lg bg-secondary p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`rounded-md px-4 py-2 text-sm transition-colors ${
                    billingCycle === 'monthly' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                    billingCycle === 'yearly' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Yearly
                  <span className="text-xs text-indigo-600">(Save 40%)</span>
                </button>
              </div>
            </div>

            <div className="mb-12 grid gap-8 md:grid-cols-3">
              {planCards.map((plan) => (
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
                    <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-sm text-white">
                      Most Popular
                    </span>
                  )}
                  {(() => {
                    const isCurrentPlan =
                      usage?.plan === plan.name.toUpperCase() &&
                      usage?.plan !== 'FREE_CREDIT' &&
                      usage?.term.toLowerCase() === billingCycle;

                    return isCurrentPlan ? (
                      <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-sm text-white">
                        Current Plan
                      </span>
                    ) : null;
                  })()}
                  <CardContent className="px-6 pb-8 pt-6">
                    <div className="mb-6">
                      <div className="mb-4 flex items-center gap-2">
                        <plan.icon className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                          ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground">USD / mo</span>
                      </div>
                      <div className="mt-1 text-sm capitalize text-muted-foreground">
                        Billed {billingCycle}
                      </div>
                    </div>

                    {isLoading && <Skeleton className="mb-6 h-10 w-full" />}
                    {isSuccess && (
                      <Button
                        variant={
                          usage?.plan !== 'FREE_CREDIT'
                            ? 'default'
                            : plan.popular
                              ? 'default'
                              : 'outline'
                        }
                        className={`mb-6 w-full capitalize ${usage?.plan !== 'FREE_CREDIT' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                        onClick={() => {
                          const action = getPlanAction(
                            usage.plan,
                            plan.name,
                            billingCycle,
                            usage.term
                          );
                          if (action === 'Choose Plan') {
                            handleChoosePlan(plan.name.toUpperCase());
                          } else if (action !== 'Current Plan') {
                            handleUpdatePlan(plan.name.toUpperCase());
                          }
                        }}
                        disabled={
                          getPlanAction(usage.plan, plan.name, billingCycle, usage.term) ===
                          'Current Plan'
                        }
                      >
                        {getPlanAction(usage.plan, plan.name, billingCycle, usage.term)}
                      </Button>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600/10">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      </div>
                      {plan.credits} credits per month
                    </div>

                    {/*<Button variant="link" className="mt-6 w-full">*/}
                    {/*  See Plan Details*/}
                    {/*  <ExternalLink className="ml-2 h-4 w-4" />*/}
                    {/*</Button>*/}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Settings className="mt-1 h-8 w-8 text-indigo-600" />
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">Need a Custom Plan?</h3>
                      <p className="text-muted-foreground">
                        Have specific needs or special requests? Contact us for a tailored solution.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Get a Quote</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
