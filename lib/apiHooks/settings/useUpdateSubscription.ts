import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/lib/api/backend';

interface UpdateSubscriptionParams {
  orgId: string;
  newPlan: 'BASIC' | 'PRO' | 'AGENCY';
  planTerm: string;
}

export const useUpdateSubscription = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ orgId, newPlan, planTerm }: UpdateSubscriptionParams) => {
      const response = await axios.post(`${BACKEND_URL}/api/update-subscription`, {
        orgId: orgId,
        plan: newPlan,
        term: planTerm,
      });
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
