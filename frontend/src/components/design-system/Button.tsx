import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

// Define button variants
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'outline' | 'link' | 'text' | 'icon'
  textClass?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', textClass, children, ...props }, ref) => {
    // If textClass is provided, wrap children in a span with that class
    const buttonContent = textClass ? <span className={textClass}>{children}</span> : children

    return (
      <button
        ref={ref}
        className={cn(
          // Base button styles
          'rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          // Size and padding
          variant !== 'text' && variant !== 'icon' && 'h-[30px] px-3 text-sm',
          // Variant-specific styles
          variant === 'primary' && 'bg-primary-1 text-secondary-5 hover:bg-primary-2',
          variant === 'outline' && 'border hover:bg-accent/10 bg-transparent',
          variant === 'text' && 'shadow-none p-0 h-auto hover:bg-transparent',
          variant === 'icon' &&
            'shadow-none h-auto flex items-center justify-center hover:bg-gray-100',
          variant === 'link' && 'text-primary underline-offset-4 hover:underline',
          // User-provided styles
          className
        )}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

Button.displayName = 'Button'
