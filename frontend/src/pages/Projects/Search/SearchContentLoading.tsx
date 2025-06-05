import { Spinner } from '@/components'

export const SearchContentLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )
}
