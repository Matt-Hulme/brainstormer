import { forwardRef, InputHTMLAttributes } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    const baseStyles =
      'bg-background flex color-secondary-4 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none placeholder:color-secondary-1 placeholder:text-h4 text-h3'

    const defaultTypography = 'text-h4 placeholder:text-h4'

    return (
      <input
        className={className ? `${baseStyles} ${className}` : `${baseStyles} ${defaultTypography}`}
        ref={ref}
        type={type}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
