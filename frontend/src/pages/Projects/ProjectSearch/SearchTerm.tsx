import { Button } from '@/components'
import { ReactNode } from 'react'

interface SearchTermProps {
  children: ReactNode
  isActive?: boolean
  onClick?: () => void
}

export const SearchTerm = ({ children, isActive = false, onClick }: SearchTermProps) => {
  return (
    <Button
      variant="text"
      className={`py-[2px] transition-all duration-200 rounded-none border-b-2 ${isActive ? 'border-primary-3' : 'border-transparent hover:border-secondary-1/30'
        } whitespace-nowrap`}
      textClass={`transition-colors ${isActive
        ? 'text-h4 font-bold text-secondary-4'
        : 'text-h4 text-secondary-2 hover:text-secondary-3'
        }`}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
