import { Button } from './design-system/Button'
import { Input } from './design-system/Input'
import { useNavigate } from 'react-router-dom'
import { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react'

interface SearchBarProps {
  searchValue: string
  onChange?: (value: string) => void
  className?: string
}

export const SearchBar = ({ searchValue, onChange, className = '' }: SearchBarProps) => {
  const navigate = useNavigate()
  // const { userId, projectName } = useParams()
  const userId = 'userId'
  const projectName = 'projectName'
  const [inputValue, setInputValue] = useState(searchValue)

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange?.(e.target.value)
  }

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(
        `/${userId}/projects/${projectName}/search?q=${encodeURIComponent(inputValue.trim())}`
      )
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="border-b-[0.5px] flex flex-row items-center justify-between pb-[25px] pt-[30px] w-full pr-[30px]">
      <Input
        type="text"
        placeholder="Start a new search"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={className}
      />
      <Button variant="outline" onClick={handleSearch}>
        Go
      </Button>
    </div>
  )
}
