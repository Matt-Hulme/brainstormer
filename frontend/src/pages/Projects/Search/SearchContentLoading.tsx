import { Spinner } from '@/components'

export const SearchContentLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-y-[20px]">
      <Spinner size="lg" />
      <p className="color-secondary-3 text-h4">We know, loading times are long. It is our number one priority!</p>
    </div>
  )
}
