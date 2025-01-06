'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { plans } from '@/lib/pricing-plan';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: {
    name: string;
    price: number;
    credits: number;
  };
}

export default function PaymentModal({ isOpen, onClose, selectedPlan }: PaymentModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>Select the plan that best fits your needs</DialogDescription>
        </DialogHeader>

        <div className="py-4">
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
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? 'border-indigo-600 shadow-md' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-sm text-white">
                    Most Popular
                  </span>
                )}
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
                    <div className="mt-1 text-sm text-muted-foreground">
                      Billed {billingCycle === 'yearly' ? 'yearly' : 'monthly'}
                    </div>
                  </div>

                  <Button variant={plan.popular ? 'default' : 'outline'} className="mb-6 w-full">
                    Choose Plan
                  </Button>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600/10">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    </div>
                    {plan.credits} credits per month
                  </div>

                  <Button variant="link" className="mt-6 w-full">
                    See Plan Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
