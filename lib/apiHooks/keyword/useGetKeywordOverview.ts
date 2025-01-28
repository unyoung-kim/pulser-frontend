import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { keywordApiUrl } from '@/constants/urlConstant';
import { useToast } from '@/hooks/use-toast';

interface keywordPayloadProps {
  orgId: string;
  phrase: string;
  database: string;
  displayOffset: number;
  kdFilter: number;
  intent: string | string[];
}

export const useGetKeywordOverview = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (keywordPayload: keywordPayloadProps) => {
      const response = await axios.post(keywordApiUrl, keywordPayload);

      if (!response.data.result.data.success) {
        throw new Error(response.data.error || 'API call failed');
      }

      return response.data.result.data.data;
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load keyword',
        variant: 'destructive',
      });
    },
  });
};
