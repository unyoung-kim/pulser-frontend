import { useQuery } from '@tanstack/react-query';
import { PlanName } from '@/lib/pricing-plan';
import { supabase } from '@/lib/supabaseClient';

interface Usage {
  credits_charged: number;
  additional_credits_charged: number;
  credits_used: number;
  plan: PlanName;
  term: 'MONTHLY' | 'YEARLY';
  is_cancelled: boolean;
  end_date: string | null;
}

export const useGetUsage = (orgId: string | null | undefined) => {
  return useQuery<Usage>({
    queryKey: ['getUsage', orgId],
    queryFn: async () => {
      if (!orgId) throw new Error('No organization ID found');

      // Fetch organization's current_usage_id
      const { data: orgData, error: orgError } = await supabase
        .from('Organization')
        .select('current_usage_id')
        .eq('org_id', orgId)
        .single();

      if (orgError) {
        if (orgError.code === 'PGRST116') {
          // If organization doesn't exist, create new usage record
          const { data: newData, error: insertError } = await supabase
            .from('Usage')
            .insert([
              {
                org_id: orgId,
                start_date: new Date().toISOString().split('T')[0],
                credits_used: 0,
                credits_charged: 0,
                additional_credits_charged: 0,
                plan: 'FREE_CREDIT',
                term: 'YEARLY',
                end_date: null,
              },
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          return mapUsageData(newData);
        }
        throw orgError;
      }

      const { data: usageData, error: usageError } = await supabase
        .from('Usage')
        .select(
          'plan, credits_charged, additional_credits_charged, credits_used, term, is_cancelled, end_date'
        )
        .eq('id', orgData.current_usage_id)
        .single();

      if (usageError) throw usageError;

      return mapUsageData(usageData);
    },
    enabled: Boolean(orgId),
  });
};

// Helper function to map and normalize usage data
const mapUsageData = (data: Partial<Usage> | null): Usage => ({
  credits_charged: data?.credits_charged ?? 0,
  additional_credits_charged: data?.additional_credits_charged ?? 0,
  credits_used: data?.credits_used ?? 0,
  plan: data?.plan ?? 'FREE_CREDIT',
  term: data?.term ?? 'YEARLY',
  is_cancelled: data?.is_cancelled ?? false,
  end_date: data?.end_date ?? null,
});
