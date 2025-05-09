import { Plus } from 'lucide-react'
import { Chip } from './design-system/Chip'

interface AddCollectionChipProps {
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const AddCollectionChip = ({ onClick, className, disabled }: AddCollectionChipProps) => {
  return (
    <Chip
      onClick={onClick}
      className={className}
      variant="outline"
      icon={<Plus size={16} />}
      disabled={disabled}
    >
      Add collection
    </Chip>
  )
}
