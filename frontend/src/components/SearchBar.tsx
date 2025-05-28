import { KeyboardEvent, useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { useCreateProjectMutation, useGetProjectsQuery } from '@/hooks'
import { Button } from './design-system/Button'
import { Input } from './design-system/Input'

interface SearchBarProps {
  className?: string
  onChange?: (value: string) => void
  searchValue: string
}

export interface SearchBarRef {
  clear: () => void
  focus: () => void
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ className = '', onChange, searchValue }, ref) => {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId?: string }>()
  const createProjectMutation = useCreateProjectMutation()
  const { projects } = useGetProjectsQuery()
  const firstInputRef = useRef<HTMLInputElement>(null)

  const initialPhrases = searchValue ? searchValue.split('||').map(p => p.trim()).filter(Boolean) : ['']
  const [phrases, setPhrases] = useState<string[]>(initialPhrases)

  // Expose clear and focus methods via ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      setPhrases([''])
    },
    focus: () => {
      firstInputRef.current?.focus()
    }
  }), [])

  useEffect(() => {
    const newPhrases = searchValue ? searchValue.split('||').map(p => p.trim()).filter(Boolean) : ['']
    setPhrases(newPhrases)
  }, [searchValue])

  const generateProjectName = () => {
    const baseName = 'Untitled Project'
    const existingUntitledProjects = projects?.filter(p => p.name.startsWith(baseName)) ?? []

    if (existingUntitledProjects.length === 0) {
      return baseName
    }

    const numbers = existingUntitledProjects.map(p => {
      const match = p.name.match(/\((\d+)\)$/)
      return match ? parseInt(match[1]) : 0
    })
    const maxNumber = Math.max(...numbers, 0)

    return `${baseName} (${maxNumber + 1})`
  }

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

    const joinedValue = newPhrases.filter(Boolean).join(' || ')
    onChange?.(joinedValue)
  }

  const onRemovePhrase = (index: number) => {
    if (phrases.length > 1) {
      const newPhrases = phrases.filter((_, i) => i !== index)
      setPhrases(newPhrases)

      const joinedValue = newPhrases.filter(Boolean).join(' || ')
      onChange?.(joinedValue)
    }
  }

  const onSearch = async () => {
    const validPhrases = phrases.filter(p => p.trim())
    if (validPhrases.length === 0) return

    const searchQuery = validPhrases.join(' || ')

    if (projectId) {
      navigate(`/projects/${projectId}/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      createProjectMutation.mutate(
        { name: generateProjectName() },
        {
          onSuccess: (project) => {
            navigate(`/projects/${project.id}/search?q=${encodeURIComponent(searchQuery)}`)
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
              ref={index === 0 ? firstInputRef : undefined}
              className={className}
              maxLength={20}
              onChange={(e) => onPhraseChange(index, e.target.value)}
              onKeyDown={(e) => onKeyDown(e, index)}
              placeholder={index === 0 ? "Start a new search" : "Add another phrase"}
              type="text"
              value={phrase}
            />
            {phrases.length > 1 && (
              <Button
                className="h-10 w-10 rounded-full"
                onClick={() => onRemovePhrase(index)}
                variant="icon"
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
            className="flex items-center gap-1"
            disabled={phrases.length >= 3}
            onClick={onAddPhrase}
            variant="outline"
          >
            <Plus size={16} /> Add Phrase
          </Button>
        )}
        <div className="ml-auto">
          <Button onClick={onSearch} variant="outline">
            Go
          </Button>
        </div>
      </div>
    </div>
  )
})

SearchBar.displayName = 'SearchBar'
