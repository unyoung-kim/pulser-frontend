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
        'text-white font-semibold py-2 px-4 rounded-lg shadow-lg',
        'border border-transparent',
        disabled
          ? 'bg-gray-400 cursor-not-allowed opacity-75 hover:bg-gray-400'
          : cn(
            'bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500',
            'hover:border-indigo-200',
            isHovered ? 'shadow-xl shadow-indigo-300/20 scale-105' : ''
          )
      )}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onClick={() =>
        !disabled && router.push(`/content/settings?projectId=${projectId}`)
      }
      disabled={disabled}
    >
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center">
          <Sparkles
            className={cn(
              'h-4 w-4 mr-2 transition-transform duration-300',
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
