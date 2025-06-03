import { Plus } from 'lucide-react'
import { Chip } from '../designSystem'

interface AddCollectionChipProps {
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export const AddCollectionChip = ({ className, disabled, onClick }: AddCollectionChipProps) => {
  return (
    <Chip
      className={className}
      disabled={disabled}
      icon={<Plus size={16} />}
      onClick={onClick}
      variant="outline"
    >
      Add collection
    </Chip>
  )
}
