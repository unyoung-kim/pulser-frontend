'use client';

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode; // Tooltip text or JSX
  children: React.ReactNode; // Element that triggers the tooltip
  side?: 'top' | 'right' | 'bottom' | 'left'; // Tooltip position
  sideOffset?: number; // Offset from the trigger
  className?: string; // Custom styling for the tooltip content
}

const Tooltip = ({ content, children, side = 'top', sideOffset = 4, className }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={50}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              'overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              className
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-current text-popover" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
