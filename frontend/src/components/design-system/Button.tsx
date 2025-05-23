import { ButtonHTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

// Define button variants
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  textClass?: string
  variant?: 'primary' | 'default' | 'outline' | 'link' | 'text' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, textClass, variant = 'primary', ...props }, ref) => {
    const buttonContent = textClass ? <span className={textClass}>{children}</span> : children

    return (
      <button
        className={classNames(
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          variant !== 'text' && variant !== 'icon' && 'h-[30px] px-3 text-sm',
          variant === 'primary' && 'rounded-md bg-primary-1 color-secondary-5 hover:bg-primary-2',
          variant === 'outline' &&
          'rounded-md border border-secondary-1 hover:bg-accent/10 bg-transparent',
          variant === 'text' && 'shadow-none p-0 h-auto hover:bg-transparent',
          variant === 'icon' &&
          'rounded-md shadow-none flex items-center justify-center group p-1 w-[35px] h-[35px]',
          variant === 'link' && 'color-primary underline-offset-4 hover:underline',
          className
        )}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

Button.displayName = 'Button'
