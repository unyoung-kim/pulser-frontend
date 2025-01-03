import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  labelClassName?: string;
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  ({ value, size = 48, strokeWidth = 6, className, labelClassName= 'text-sm', ...props }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className={cn('transform -rotate-90', className)}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          ref={ref}
          {...props}
        >
          <circle
            className="text-gray-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-indigo-600"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-medium', labelClassName)}>{value}</span>
        </div>
      </div>
    );
  }
);

ProgressRing.displayName = 'ProgressRing';

export default ProgressRing;

