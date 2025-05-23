import { Button } from './design-system/Button'
import { Input } from './design-system/Input'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, KeyboardEvent, useEffect } from 'react'
import { useCreateProjectMutation, useGetProjectsQuery } from '@/hooks'
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
  const { projects } = useGetProjectsQuery()

  useEffect(() => {
    // When searchValue changes externally, update phrases
    const newPhrases = searchValue ? searchValue.split('||').map(p => p.trim()).filter(Boolean) : ['']
    setPhrases(newPhrases)
  }, [searchValue])

  const onAddPhrase = () => {
    if (phrases.length < 3) {
      setPhrases([...phrases, ''])
    }
  }

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  const onPhraseChange = (index: number, value: string) => {
    const newPhrases = [...phrases]
    newPhrases[index] = value
    setPhrases(newPhrases)

    // Call parent onChange with joined phrases
    const joinedValue = newPhrases.filter(Boolean).join(' || ')
    onChange?.(joinedValue)
  }

  const onRemovePhrase = (index: number) => {
    if (phrases.length > 1) {
      const newPhrases = phrases.filter((_, i) => i !== index)
      setPhrases(newPhrases)

      // Call parent onChange with joined phrases
      const joinedValue = newPhrases.filter(Boolean).join(' || ')
      onChange?.(joinedValue)
    }
  }

  const generateProjectName = () => {
    const baseName = 'Untitled Project'
    const existingUntitledProjects = projects?.filter(p => p.name.startsWith(baseName)) ?? []

    if (existingUntitledProjects.length === 0) {
      return baseName
    }

    // Find the highest number used
    const numbers = existingUntitledProjects.map(p => {
      const match = p.name.match(/\((\d+)\)$/)
      return match ? parseInt(match[1]) : 0
    })
    const maxNumber = Math.max(...numbers, 0)

    return `${baseName} (${maxNumber + 1})`
  }

  const onSearch = async () => {
    // Filter out empty phrases
    const validPhrases = phrases.filter(p => p.trim())
    if (validPhrases.length === 0) return

    // Join all phrases with delimiter
    const searchQuery = validPhrases.join(' || ')

    if (projectName) {
      navigate(`/projects/${projectName}/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      // Create a new project with the generated name
      createProjectMutation.mutate(
        { name: generateProjectName() },
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
              onChange={(e) => onPhraseChange(index, e.target.value)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={className}
              maxLength={20} // Limiting to ~3 words
            />
            {phrases.length > 1 && (
              <Button
                variant="icon"
                onClick={() => onRemovePhrase(index)}
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
            onClick={onAddPhrase}
            className="flex items-center gap-1"
            disabled={phrases.length >= 3}
          >
            <Plus size={16} /> Add Phrase
          </Button>
        )}
        <div className="ml-auto">
          <Button variant="outline" onClick={onSearch}>
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
