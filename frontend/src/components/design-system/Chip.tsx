import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import classNames from 'classnames'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  icon?: ReactNode
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant = 'default', icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'gap-1 inline-flex items-center px-[10px] py-[5px] rounded-full text-sm',
          variant === 'default' && 'bg-secondary-1/10 text-secondary-1 hover:bg-secondary-1/20',
          variant === 'outline' &&
            'border text-secondary-2 border-secondary-1/40 hover:bg-secondary-1/10 bg-transparent',
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </button>
    )
  }
)

Chip.displayName = 'Chip'
