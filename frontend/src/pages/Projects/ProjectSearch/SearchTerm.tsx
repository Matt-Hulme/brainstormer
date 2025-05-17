import { Button } from '@/components'
import { ReactNode } from 'react'

interface SearchTermProps {
  children: ReactNode
  isActive?: boolean
  onClick?: () => void
  matchType?: 'and' | 'or'
}

export const SearchTerm = ({
  children,
  isActive = false,
  onClick,
  matchType
}: SearchTermProps) => {
  return (
    <Button
      variant="text"
      className={`py-[2px] transition-all duration-200 rounded-none border-b-2 ${isActive
          ? 'border-primary-3'
          : matchType === 'and'
            ? 'border-accent/80 hover:border-accent'
            : 'border-transparent hover:border-secondary-1/30'
        } whitespace-nowrap ${matchType === 'and' && !isActive ? 'bg-accent/5' : ''
        }`}
      textClass={`transition-colors ${isActive
          ? 'text-h4 font-bold text-secondary-4'
          : matchType === 'and'
            ? 'text-h4 font-medium text-primary-1 hover:text-primary-1/90'
            : 'text-h4 text-secondary-2 hover:text-secondary-3'
        }`}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
