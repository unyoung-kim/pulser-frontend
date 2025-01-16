import { Briefcase, Building2, User } from 'lucide-react';

// Plan names including all possible plans
export type PlanName = 'FREE_CREDIT' | 'BASIC' | 'PRO' | 'AGENCY';

// Structure for card-specific plans
interface PlanCard {
  name: Exclude<PlanName, 'FREE_CREDIT'>; // Exclude FREE_CREDIT from cards
  icon: any;
  monthlyPrice: number;
  yearlyPrice: number;
  credits: number;
  popular?: boolean;
}

// Array of all plan names
const planNames: PlanName[] = ['FREE_CREDIT', 'BASIC', 'PRO', 'AGENCY'];

// Data specifically for rendering cards
export const planCards: PlanCard[] = [
  {
    name: 'BASIC',
    icon: User,
    monthlyPrice: 49,
    yearlyPrice: 39,
    credits: 100,
  },
  {
    name: 'PRO',
    icon: Briefcase,
    monthlyPrice: 109,
    yearlyPrice: 99,
    credits: 250,
    popular: true,
  },
  {
    name: 'AGENCY',
    icon: Building2,
    monthlyPrice: 419,
    yearlyPrice: 379,
    credits: 1000,
  },
];

// Possible statuses for a plan
type PlanAction =
  | 'Choose Plan'
  | 'Current Plan'
  | 'Upgrade Plan'
  | 'Downgrade Plan'
  | `Update With ${string} Plan`;

// Function to determine plan status
export const getPlanAction = (
  currentPlan: PlanName,
  targetPlan: PlanName,
  billingCycle: string,
  term: string
): PlanAction => {
  if (currentPlan === 'FREE_CREDIT') return 'Choose Plan';
  const currentIndex = planNames.findIndex((name) => name === currentPlan);
  const targetIndex = planNames.findIndex((name) => name === targetPlan);

  if (currentIndex === targetIndex && term === billingCycle?.toUpperCase()) return 'Current Plan';
  return currentIndex === targetIndex
    ? (`Update With ${billingCycle} Plan` as PlanAction)
    : targetIndex > currentIndex
      ? 'Upgrade Plan'
      : 'Downgrade Plan';
};
