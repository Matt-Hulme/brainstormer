import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

// Create a new interface without overriding the variant prop
export interface ButtonProps extends Omit<ShadcnButtonProps, 'variant'> {
  // Define our custom variants
  variant?: 'primary' | 'default' | 'outline' | 'link' | 'text'
  textStyle?: string // Optional prop for text styling
  textClass?: string // Additional class specifically for the text
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', textStyle, textClass, children, ...props }, ref) => {
    // Map our app-specific variants to shadcn variants
    let mappedVariant: ShadcnButtonProps['variant'] = 'default'

    if (variant === 'primary') mappedVariant = 'default'
    else if (variant === 'text') mappedVariant = 'ghost'
    else if (variant === 'outline' || variant === 'link' || variant === 'default') {
      mappedVariant = variant
    }

    // If textClass is provided, wrap children in a span with that class
    const buttonContent = textClass ? <span className={textClass}>{children}</span> : children

    return (
      <ShadcnButton
        ref={ref}
        variant={mappedVariant}
        className={cn(
          // Add any global button styles here
          variant === 'primary' && 'bg-primary-1 text-secondary-5 hover:bg-primary-2',
          variant === 'text' && 'shadow-none p-0 h-auto hover:bg-transparent',
          textStyle, // Apply custom text styling
          className
        )}
        {...props}
      >
        {buttonContent}
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'
