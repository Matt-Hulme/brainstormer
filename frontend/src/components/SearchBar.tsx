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
  const [inputValue, setInputValue] = useState(searchValue)
  const navigate = useNavigate()
  const userId = 'userId'
  const projectName = 'projectName'

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange?.(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(
        `/${userId}/projects/${projectName}/search?q=${encodeURIComponent(inputValue.trim())}`
      )
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
