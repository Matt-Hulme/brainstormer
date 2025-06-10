import { KeyboardEvent, useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'
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



  const sanitizePhrase = (phrase: string): string => {
    // Replace multiple consecutive spaces with single space
    return phrase.replace(/\s{2,}/g, ' ')
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
    // Sanitize input - replace multiple spaces with single space
    const sanitized = sanitizePhrase(value)

    // Check if this would exceed 3 words
    const words = sanitized.trim().split(/\s+/).filter(Boolean)
    if (words.length > 3) {
      // Block the input - don't update state
      return
    }

    // If we already have 3 words, don't allow trailing spaces
    if (words.length === 3 && sanitized.endsWith(' ')) {
      // Block trailing space when we already have 3 words
      return
    }

    const newPhrases = [...phrases]
    newPhrases[index] = sanitized
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

    if (validPhrases.length === 0) {
      toast.error('Please enter at least one phrase to search')
      return
    }

    const searchQuery = validPhrases.join(' + ')

    if (projectId) {
      // We're in an existing project - just navigate to search
      navigate(`/projects/${projectId}/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      // We're on ProjectsList page - create both project and collection
      try {
        const project = await createProjectMutation.mutateAsync({ name: generateProjectName() })
        // Navigate to search page - the Search component will handle creating the collection
        navigate(`/projects/${project.id}/search?q=${encodeURIComponent(searchQuery)}`)
      } catch (error) {
        console.error('Error creating project:', error)
        toast.error('Failed to create project')
      }
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
                data-phrase-index={index}
                maxLength={120} // Increased to accommodate 3 words with spaces
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPhraseChange(index, e.target.value)}
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