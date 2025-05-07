import { Plus } from 'lucide-react'
import { Chip } from './design-system/Chip'

interface AddCollectionChipProps {
  onClick?: () => void
  className?: string
}

export const AddCollectionChip = ({ onClick, className }: AddCollectionChipProps) => {
  return (
    <Chip onClick={onClick} className={className} variant="outline" icon={<Plus size={16} />}>
      Add collection
    </Chip>
  )
}
