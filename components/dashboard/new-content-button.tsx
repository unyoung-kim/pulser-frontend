'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NewContentButtonProps {
  disabled?: boolean;
}

export function NewContentButton({ disabled }: NewContentButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams?.get('projectId') || '';

  return (
    <Button
      className={cn(
        'w-full justify-between transition-all duration-300 ease-in-out',
        'rounded-lg px-4 py-2 font-semibold text-white shadow-lg',
        'border border-transparent',
        disabled
          ? 'cursor-not-allowed bg-gray-400 opacity-75 hover:bg-gray-400'
          : cn(
              'bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500',
              'hover:border-indigo-200',
              isHovered ? 'scale-105 shadow-xl shadow-indigo-300/20' : ''
            )
      )}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onClick={() => !disabled && router.push(`/content/settings?projectId=${projectId}`)}
      disabled={disabled}
    >
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center">
          <Sparkles
            className={cn(
              'mr-2 h-4 w-4 transition-transform duration-300',
              !disabled && isHovered ? 'animate-pulse duration-1000' : ''
            )}
          />
          <span>New Content</span>
        </span>
        <Plus
          className={cn(
            'h-4 w-4 transition-transform duration-300',
            !disabled && isHovered ? 'animate-pulse duration-1000' : ''
          )}
        />
      </div>
    </Button>
  );
}
