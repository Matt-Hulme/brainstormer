import { Button } from '@/components'
import { ReactNode, useEffect, useState } from 'react'

interface SearchResultProps {
    children: ReactNode
    isActive?: boolean
    onClick?: () => void
    onAnimationComplete?: () => void
    skipAnimation?: boolean
    staggerIndex?: number
}

export const SearchResult = ({
    children,
    isActive = false,
    onClick,
    onAnimationComplete,
    skipAnimation = false,
    staggerIndex = 0,
}: SearchResultProps) => {
    const [hasStartedAnimation, setHasStartedAnimation] = useState(skipAnimation)

    // For cached data, call completion immediately
    useEffect(() => {
        if (skipAnimation && onAnimationComplete) {
            onAnimationComplete()
        }
    }, [skipAnimation, onAnimationComplete])

    // For streaming data, set animation start flag when delay begins
    useEffect(() => {
        if (skipAnimation) {
            setHasStartedAnimation(true)
            return
        }

        const startTimer = setTimeout(() => {
            setHasStartedAnimation(true)
        }, staggerIndex * 50)

        return () => clearTimeout(startTimer)
    }, [skipAnimation, staggerIndex])

    // For streaming data, call completion after animation
    useEffect(() => {
        if (!skipAnimation && onAnimationComplete) {
            const timer = setTimeout(onAnimationComplete, 600 + (staggerIndex * 50))
            return () => clearTimeout(timer)
        }
    }, [skipAnimation, onAnimationComplete, staggerIndex])

    // Don't render anything until animation should start
    if (!hasStartedAnimation) {
        return null
    }

    return (
        <div
            className={`${skipAnimation
                ? 'opacity-100'
                : 'opacity-0 animate-fade-in'
                }`}
            style={{
                animationDelay: skipAnimation ? '0ms' : '0ms' // No delay needed since we control visibility above
            }}
        >
            <Button
                variant="text"
                className={`py-[2px] transition-all duration-200 rounded-none border-b-2 ${isActive
                    ? 'border-primary-3'
                    : 'border-transparent hover:border-secondary-1/30'
                    } whitespace-nowrap ${!isActive ? 'bg-accent/5' : ''
                    }`}
                textClass={`transition-colors ${isActive
                    ? 'text-h4 font-bold color-secondary-4'
                    : 'text-h4 text-secondary-2 hover:text-secondary-3'
                    }`}
                onClick={onClick}
            >
                {children}
            </Button>
        </div>
    )
}