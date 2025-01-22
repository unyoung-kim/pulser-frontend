import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { z } from 'zod';
import { BackgroundSchema2 } from '@/components/background/Form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const useUpdateBackground = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newData: Partial<z.infer<typeof BackgroundSchema2>>) => {
      const { error } = await supabase
        .from('Project')
        .update({ background: newData })
        .eq('id', projectId);

      if (error) throw error;
      return newData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast({
        title: '🎉 Success',
        description: 'Background information saved successfully',
        icon: <Check className="h-6 w-6 text-green-500" />,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save background information',
        variant: 'destructive',
      });
      console.error(error);
    },
  });
};
