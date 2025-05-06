import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'bg-background flex text-h4 text-secondary-1 w-full disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none placeholder:text-h4 placeholder:text-secondary-1',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
