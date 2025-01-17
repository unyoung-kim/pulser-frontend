import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/lib/api/backend';

interface UpdateSubscriptionParams {
  orgId: string;
  newPlan: 'BASIC' | 'PRO' | 'AGENCY';
  planTerm: string;
  couponCode?: string;
}

export const useUpdateSubscription = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ orgId, newPlan, planTerm, couponCode }: UpdateSubscriptionParams) => {
      const payload = {
        orgId: orgId,
        plan: newPlan,
        term: planTerm,
        ...(couponCode && couponCode.trim() !== '' && { couponCode }),
      };

      const response = await axios.post(`${BACKEND_URL}/api/update-subscription`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your subscription has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to update subscription',
      });
    },
  });
};
