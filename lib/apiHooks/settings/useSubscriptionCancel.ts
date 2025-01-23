import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { deleteSubscriptionUrl } from '@/constants/urlConstant';
import { useToast } from '@/hooks/use-toast';

export const useSubscriptionCancel = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (orgId: string) => {
      const response = await axios.post(deleteSubscriptionUrl, {
        orgId,
      });
      const data = response.data;

      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Subscription Cancelled',
        description:
          'Your subscription has been cancelled. You can use your credits until the next billing date.',
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
};
