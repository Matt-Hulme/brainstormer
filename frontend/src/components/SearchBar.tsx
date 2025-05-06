import { Button } from './design-system/Button'
import { Input } from './design-system/Input'
import { useNavigate } from 'react-router-dom'

export const SearchBar = () => {
  const navigate = useNavigate()

  return (
    <div className="border-b-[0.5px] flex flex-row items-center justify-between pb-[25px] pt-[30px] w-full pr-[30px]">
      <Input type="text" placeholder="Start a new search" />
      <Button variant="outline" onClick={() => navigate('/projects/123/search')}>
        Go
      </Button>
    </div>
  )
}
