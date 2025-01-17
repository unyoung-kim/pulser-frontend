import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/lib/api/backend';

interface CreateSubscriptionParams {
  orgId: string;
  newPlan: 'BASIC' | 'PRO' | 'AGENCY';
  planTerm: string;
  mode: string;
  couponCode?: string;
}

export const useCreateSubscription = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      orgId,
      newPlan,
      planTerm,
      mode,
      couponCode,
    }: CreateSubscriptionParams) => {
      const payload = {
        orgId: orgId,
        plan: newPlan,
        term: planTerm,
        mode: mode,
        ...(couponCode && couponCode.trim() !== '' && { couponCode }),
      };

      const response = await axios.post(`${BACKEND_URL}/api/create-stripe-session`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      const url = data?.data; // Extract the URL from the response

      if (url) {
        window.location.href = url; // Redirect to the URL
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load the checkout page.',
        });
      }
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to create subscription.',
      });
    },
  });
};
