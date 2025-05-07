import { ButtonHTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

// Define button variants
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'outline' | 'link' | 'text' | 'icon'
  textClass?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', textClass, children, ...props }, ref) => {
    const buttonContent = textClass ? <span className={textClass}>{children}</span> : children

    return (
      <button
        ref={ref}
        className={classNames(
          'rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          variant !== 'text' && variant !== 'icon' && 'h-[30px] px-3 text-sm',
          variant === 'primary' && 'bg-primary-1 text-secondary-5 hover:bg-primary-2',
          variant === 'outline' && 'border border-secondary-1 hover:bg-accent/10 bg-transparent',
          variant === 'text' && 'shadow-none p-0 h-auto hover:bg-transparent',
          variant === 'icon' && 'shadow-none h-auto flex items-center justify-center group',
          variant === 'link' && 'text-primary underline-offset-4 hover:underline',
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
