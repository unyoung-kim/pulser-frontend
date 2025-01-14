import { Dispatch, SetStateAction } from 'react';
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
}

export const useGetUsage = (
  orgId: undefined | null | string,
  setBillingCycle: Dispatch<SetStateAction<'monthly' | 'yearly'>>
) => {
  return useQuery<Usage>({
    queryKey: ['usage', orgId],
    queryFn: async () => {
      if (!orgId) throw new Error('No organization ID found');

      // First, get the organization and its current_usage_id
      const { data: orgData, error: orgError } = await supabase
        .from('Organization')
        .select('current_usage_id')
        .eq('org_id', orgId)
        .single();

      if (orgError) {
        // If org doesn't exist, create new usage and org records
        if (orgError.code === 'PGRST116') {
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

          return {
            credits_charged: newData?.credits_charged ?? 0,
            additional_credits_charged: newData?.additional_credits_charged ?? 0,
            credits_used: newData?.credits_used ?? 0,
            plan: newData?.plan ?? 'FREE_CREDIT',
            term: newData?.term ?? 'YEARLY',
            is_cancelled: newData?.is_cancelled ?? false,
            end_date: newData?.end_date ?? '',
          };
        }
        throw orgError;
      }

      // Then fetch the usage data using the current_usage_id
      const { data, error } = await supabase
        .from('Usage')
        .select(
          'plan, credits_charged, additional_credits_charged, credits_used, term, is_cancelled'
        )
        .eq('id', orgData.current_usage_id)
        .single();

      if (error) throw error;

      setBillingCycle(data?.term?.toLowerCase() as 'monthly' | 'yearly');

      return {
        credits_charged: data?.credits_charged ?? 0,
        additional_credits_charged: data?.additional_credits_charged ?? 0,
        credits_used: data?.credits_used ?? 0,
        plan: data?.plan ?? 'FREE_CREDIT',
        term: data?.term ?? 'YEARLY',
        is_cancelled: data?.is_cancelled ?? false,
      };
    },
    enabled: !!orgId,
  });
};
