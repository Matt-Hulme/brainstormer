import { forwardRef, InputHTMLAttributes } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    const baseStyles =
      'bg-background flex w-full disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none text-secondary-1 placeholder:text-secondary-1'

    const defaultTypography = 'text-h4 placeholder:text-h4'

    return (
      <input
        type={type}
        className={className ? `${baseStyles} ${className}` : `${baseStyles} ${defaultTypography}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
