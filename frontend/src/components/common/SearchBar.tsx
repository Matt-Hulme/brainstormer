import { KeyboardEvent, useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { useCreateProjectMutation, useGetProjectsQuery } from '@/hooks'
import { AutoSizeInput, Button } from '../designSystem'

interface SearchBarProps {
  className?: string
  searchValue: string
}

export interface SearchBarRef {
  clear: () => void
  focus: () => void
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ className = '', searchValue }, ref) => {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId?: string }>()
  const createProjectMutation = useCreateProjectMutation()
  const { projects } = useGetProjectsQuery()
  const firstInputRef = useRef<HTMLInputElement>(null)

  const initialPhrases = searchValue ? searchValue.split('+').map(p => p.trim()).filter(Boolean) : ['']
  const [phrases, setPhrases] = useState<string[]>(initialPhrases)
  const hasPhrase = phrases.some(phrase => phrase.trim())

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
    const newPhrases = searchValue ? searchValue.split('+').map(p => p.trim()).filter(Boolean) : ['']
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  const onPhraseChange = (index: number, value: string) => {
    const newPhrases = [...phrases]
    // Replace multiple consecutive spaces with single spaces
    const sanitizedValue = value.replace(/\s{2,}/g, ' ')
    newPhrases[index] = sanitizedValue
    setPhrases(newPhrases)
  }

  const onRemovePhrase = (index: number) => {
    if (phrases.length > 1) {
      const newPhrases = phrases.filter((_, i) => i !== index)
      setPhrases(newPhrases)
    }
  }

  const onSearch = async () => {
    const validPhrases = phrases.filter(p => p.trim())
    if (validPhrases.length === 0) return

    const searchQuery = validPhrases.join(' + ')

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
    <div className="border-b-[0.5px] flex items-center pb-[25px] pr-[30px] pt-[30px]">
      <div className="flex flex-row gap-[10px] items-center flex-wrap">
        {phrases.map((phrase, index) => {
          const placeholder = index === 0 ? "Start a new search" : "Add another phrase"
          return (
            <div key={index} className="flex gap-[10px] items-center flex-shrink-0">
              <AutoSizeInput
                ref={index === 0 ? firstInputRef : undefined}
                className={className}
                maxLength={40}
                onChange={(e) => onPhraseChange(index, e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                value={phrase}
              />
              {phrases.length > 1 && (
                <Button
                  className="color-secondary-3 h-10 rounded-full w-10 flex-shrink-0"
                  onClick={() => onRemovePhrase(index)}
                  variant="icon"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          )
        })}
        {phrases.length < 3 && hasPhrase && (
          <Button
            className="flex gap-1 items-center flex-shrink-0"
            disabled={phrases.length >= 3}
            onClick={onAddPhrase}
            variant="icon"
          >
            <Plus size={16} />
          </Button>
        )}
      </div>
      {hasPhrase && (
        <Button className="ml-auto flex-shrink-0" onClick={onSearch} variant="outline">
          Go
        </Button>
      )}
    </div>
  )
})

SearchBar.displayName = 'SearchBar'