import { Briefcase, Building2, User } from 'lucide-react';

export interface PricingPlan {
  name: string;
  icon: any; // You could make this more specific with LucideIcon type if you want
  monthlyPrice: number;
  yearlyPrice: number;
  credits: number;
  popular?: boolean;
}

export const plans: PricingPlan[] = [
  {
    name: 'Basic',
    icon: User,
    monthlyPrice: 49,
    yearlyPrice: 39,
    credits: 100,
  },
  {
    name: 'Pro',
    icon: Briefcase,
    monthlyPrice: 109,
    yearlyPrice: 99,
    credits: 250,
    popular: true,
  },
  {
    name: 'Agency',
    icon: Building2,
    monthlyPrice: 419,
    yearlyPrice: 379,
    credits: 1000,
  },
];
