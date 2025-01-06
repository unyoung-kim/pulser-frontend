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
                className={`relative ${plan.popular ? 'border-indigo-600 shadow-md' : ''}`}
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
                        ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">USD / mo</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Billed {billingCycle === 'yearly' ? 'yearly' : 'monthly'}
                    </div>
                  </div>

                  <Button variant={plan.popular ? 'default' : 'outline'} className="w-full mb-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
