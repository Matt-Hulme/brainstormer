import { Button } from './design-system/Button'
import { Input } from './design-system/Input'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react'
import { useCreateProjectMutation } from '@/hooks'
import { Plus, X } from 'lucide-react'

interface SearchBarProps {
  searchValue: string
  onChange?: (value: string) => void
  className?: string
}

export const SearchBar = ({ searchValue, onChange, className = '' }: SearchBarProps) => {
  // Parse search value into phrases if it contains the delimiter
  const initialPhrases = searchValue ? searchValue.split('||').map(p => p.trim()).filter(Boolean) : ['']
  const [phrases, setPhrases] = useState<string[]>(initialPhrases)

  const navigate = useNavigate()
  const { projectName } = useParams<{ projectName?: string }>()
  const createProjectMutation = useCreateProjectMutation()

  useEffect(() => {
    // When searchValue changes externally, update phrases
    const newPhrases = searchValue ? searchValue.split('||').map(p => p.trim()).filter(Boolean) : ['']
    setPhrases(newPhrases)
  }, [searchValue])

  const handlePhraseChange = (index: number, value: string) => {
    const newPhrases = [...phrases]
    newPhrases[index] = value
    setPhrases(newPhrases)

    // Call parent onChange with joined phrases
    const joinedValue = newPhrases.filter(Boolean).join(' || ')
    onChange?.(joinedValue)
  }

  const handleAddPhrase = () => {
    if (phrases.length < 3) {
      setPhrases([...phrases, ''])
    }
  }

  const handleRemovePhrase = (index: number) => {
    if (phrases.length > 1) {
      const newPhrases = phrases.filter((_, i) => i !== index)
      setPhrases(newPhrases)

      // Call parent onChange with joined phrases
      const joinedValue = newPhrases.filter(Boolean).join(' || ')
      onChange?.(joinedValue)
    }
  }

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = async () => {
    // Filter out empty phrases
    const validPhrases = phrases.filter(p => p.trim())
    if (validPhrases.length === 0) return

    // Join all phrases with delimiter
    const searchQuery = validPhrases.join(' || ')

    if (projectName) {
      navigate(`/projects/${projectName}/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      // Create a new project, then navigate
      // Use first phrase as project name
      createProjectMutation.mutate(
        { name: validPhrases[0].trim() },
        {
          onSuccess: (project) => {
            navigate(`/projects/${project.name}/search?q=${encodeURIComponent(searchQuery)}`)
          },
        }
      )
    }
  }

  return (
    <div className="border-b-[0.5px] flex flex-col items-start justify-between pb-[25px] pt-[30px] w-full pr-[30px]">
      <div className="w-full flex flex-col gap-2">
        {phrases.map((phrase, index) => (
          <div key={index} className="flex items-center gap-2 w-full">
            <Input
              type="text"
              placeholder={index === 0 ? "Start a new search" : "Add another phrase"}
              value={phrase}
              onChange={(e) => handlePhraseChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={className}
              maxLength={20} // Limiting to ~3 words
            />
            {phrases.length > 1 && (
              <Button
                variant="icon"
                onClick={() => handleRemovePhrase(index)}
                className="h-10 w-10 rounded-full"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between w-full mt-4">
        {phrases.length < 3 && (
          <Button
            variant="outline"
            onClick={handleAddPhrase}
            className="flex items-center gap-1"
            disabled={phrases.length >= 3}
          >
            <Plus size={16} /> Add Phrase
          </Button>
        )}
        <div className="ml-auto">
          <Button variant="outline" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
