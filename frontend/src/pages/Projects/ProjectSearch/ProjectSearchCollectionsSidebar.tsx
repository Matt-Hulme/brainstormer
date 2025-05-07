import { AddCollectionChip } from '@/components'

export const ProjectSearchCollectionsSidebar = () => {
  return (
    <aside className="px-[30px] py-[10px] space-y-[15px] min-w-[244px] h-full">
      <div className="flex justify-between items-center">
        <p className="text-p3 text-secondary-2">SAVED WORDS</p>
      </div>
      <div className="w-full h-[1px] bg-secondary-1/20" />
      <p className="text-p3 text-secondary-1">No words (yet)</p>
      <AddCollectionChip onClick={() => {}} />
    </aside>
  )
}
