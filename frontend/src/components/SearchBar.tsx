import { Button } from './design-system/Button'
import { Input } from './design-system/Input'

export const SearchBar = () => {
  return (
    <div className="border-b-[0.5px] flex flex-row items-center justify-between pb-[25px] pt-[30px] w-full pr-[30px]">
      <Input type="text" placeholder="Start a new search" />
      <Button variant="outline">Go</Button>
    </div>
  )
}
