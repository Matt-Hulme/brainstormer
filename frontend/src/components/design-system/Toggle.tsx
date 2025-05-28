import { ButtonHTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

// Define toggle variants
export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean
    onChange: (checked: boolean) => void
    variant?: 'default' | 'primary'
    size?: 'sm' | 'md'
    leftLabel?: string
    rightLabel?: string
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
    ({
        checked,
        onChange,
        variant = 'default',
        size = 'md',
        leftLabel,
        rightLabel,
        className,
        disabled,
        ...props
    }, ref) => {
        const handleClick = () => {
            if (!disabled) {
                onChange(!checked)
            }
        }

        return (
            <div className="flex items-center gap-3">
                {leftLabel && (
                    <span className={classNames(
                        'text-sm transition-colors',
                        !checked && !disabled ? 'color-secondary-4 font-medium' : 'color-secondary-2',
                        disabled && 'opacity-50'
                    )}>
                        {leftLabel}
                    </span>
                )}

                <button
                    ref={ref}
                    onClick={handleClick}
                    disabled={disabled}
                    className={classNames(
                        'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                        // Size variants
                        size === 'sm' && 'h-5 w-9',
                        size === 'md' && 'h-6 w-11',
                        // Color variants
                        variant === 'default' && [
                            checked ? 'bg-primary-1' : 'bg-secondary-1',
                            'focus:ring-primary-1'
                        ],
                        variant === 'primary' && [
                            checked ? 'bg-primary-1' : 'bg-secondary-1',
                            'focus:ring-primary-1'
                        ],
                        // Disabled state
                        disabled && 'opacity-50 cursor-not-allowed',
                        className
                    )}
                    {...props}
                >
                    <span
                        className={classNames(
                            'inline-block transform rounded-full bg-white transition-transform',
                            // Size variants for the thumb
                            size === 'sm' && [
                                'h-3 w-3',
                                checked ? 'translate-x-5' : 'translate-x-1'
                            ],
                            size === 'md' && [
                                'h-4 w-4',
                                checked ? 'translate-x-6' : 'translate-x-1'
                            ]
                        )}
                    />
                </button>

                {rightLabel && (
                    <span className={classNames(
                        'text-sm transition-colors',
                        checked && !disabled ? 'color-secondary-4 font-medium' : 'color-secondary-2',
                        disabled && 'opacity-50'
                    )}>
                        {rightLabel}
                    </span>
                )}
            </div>
        )
    }
)

Toggle.displayName = 'Toggle' 