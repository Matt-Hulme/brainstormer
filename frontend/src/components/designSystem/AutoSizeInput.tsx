import { forwardRef, KeyboardEvent } from 'react'

interface AutoSizeInputProps {
    className?: string
    maxLength?: number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
    onKeyDown?: (e: KeyboardEvent) => void
    placeholder?: string
    value: string
}

export const AutoSizeInput = forwardRef<HTMLInputElement, AutoSizeInputProps>(
    ({ className = '', maxLength, onChange, onFocus, onKeyDown, placeholder = '', value }, ref) => {
        // If there's actual content, measure that. Otherwise use placeholder with minimum fallback
        const measureText = value.length > 0 ? value : placeholder || 'Type here'

        const baseStyles = 'bg-background color-secondary-4 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none placeholder:color-secondary-1'

        return (
            <div className="relative" style={{ width: 'fit-content', display: 'inline-block' }}>
                <div
                    className={`${baseStyles} ${className} invisible whitespace-pre pointer-events-none select-none`}
                    aria-hidden="true"
                >
                    {measureText}
                </div>
                <input
                    ref={ref}
                    className={`${baseStyles} ${className} bg-transparent border-0 outline-0 absolute top-0 left-0 w-full h-full`}
                    maxLength={maxLength}
                    onChange={onChange}
                    onFocus={onFocus || ((e) => e.target.select())}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    type="text"
                    value={value}
                />
            </div>
        )
    }
)

AutoSizeInput.displayName = 'AutoSizeInput' 