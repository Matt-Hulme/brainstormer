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

  const initialWords = searchValue ? searchValue.split('+').map(w => w.trim()).filter(Boolean) : ['']
  const [words, setWords] = useState<string[]>(initialWords)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const hasWord = words.some(word => word.trim())

  // Expose clear and focus methods via ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      setWords([''])
      setValidationErrors([])
    },
    focus: () => {
      firstInputRef.current?.focus()
    }
  }), [])

  useEffect(() => {
    const newWords = searchValue ? searchValue.split('+').map(w => w.trim()).filter(Boolean) : ['']
    setWords(newWords)
    setValidationErrors([])
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

  const validateWord = (word: string): string | null => {
    const trimmed = word.trim()

    if (!trimmed) return null // Empty is fine, will be filtered out

    // Check for spaces within the word
    if (trimmed.includes(' ')) {
      return 'Single words only - no spaces allowed'
    }

    // Check for reasonable length
    if (trimmed.length > 40) {
      return 'Word too long (max 40 characters)'
    }

    return null
  }

  const validateAllWords = (wordList: string[]): string[] => {
    const errors: string[] = []
    const nonEmptyWords = wordList.filter(w => w.trim())

    // Check max word count
    if (nonEmptyWords.length > 5) {
      errors.push('Maximum 5 words allowed')
    }

    // Check individual words
    wordList.forEach((word, index) => {
      const error = validateWord(word)
      if (error) {
        errors.push(`Word ${index + 1}: ${error}`)
      }
    })

    return errors
  }

  const onAddWord = () => {
    if (words.length < 5) {
      setWords([...words, ''])
      setValidationErrors([])
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  const onWordChange = (index: number, value: string) => {
    // Check if user typed a space
    if (value.includes(' ')) {
      const parts = value.split(' ')
      const currentWord = parts[0] // Word before the space
      const remainingText = parts.slice(1).join(' ').trim() // Text after the space

      // Update current field with the word before the space
      const newWords = [...words]
      newWords[index] = currentWord
      setWords(newWords)

      // If we're not at max words, move to next field
      if (words.length < 5) {
        // Add new word if we're at the last field
        if (index === words.length - 1) {
          const updatedWords = [...newWords, remainingText]
          setWords(updatedWords)

          // Focus the new input after a brief delay
          setTimeout(() => {
            const nextInput = document.querySelector(`input[data-word-index="${index + 1}"]`) as HTMLInputElement
            if (nextInput) {
              nextInput.focus()
              nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length)
            }
          }, 0)
        } else {
          // Focus existing next input and set its value
          const nextInput = document.querySelector(`input[data-word-index="${index + 1}"]`) as HTMLInputElement
          if (nextInput) {
            newWords[index + 1] = remainingText
            setWords(newWords)
            setTimeout(() => {
              nextInput.focus()
              nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length)
            }, 0)
          }
        }
      }

      // Clear validation errors when user starts typing
      if (validationErrors.length > 0) {
        setValidationErrors([])
      }
      return
    }

    const newWords = [...words]
    // Remove multiple consecutive spaces and trim leading/trailing spaces
    const sanitizedValue = value.replace(/\s{2,}/g, ' ').trim()
    newWords[index] = sanitizedValue
    setWords(newWords)

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const onRemoveWord = (index: number) => {
    if (words.length > 1) {
      const newWords = words.filter((_, i) => i !== index)
      setWords(newWords)
      setValidationErrors([])
    }
  }

  const onSearch = async () => {
    const validWords = words.filter(w => w.trim())

    if (validWords.length === 0) {
      toast.error('Please enter at least one word to search')
      return
    }

    // Validate all words before searching
    const errors = validateAllWords(validWords)
    if (errors.length > 0) {
      setValidationErrors(errors)
      toast.error(errors[0]) // Show first error in toast
      return
    }

    const searchQuery = validWords.join(' + ')

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
        {words.map((word, index) => {
          const placeholder = index === 0 ? "Start a new search" : "Add another word"
          const hasError = validationErrors.some(error => error.startsWith(`Word ${index + 1}:`))

          return (
            <div key={index} className="flex gap-[10px] items-center flex-shrink-0">
              <AutoSizeInput
                ref={index === 0 ? firstInputRef : undefined}
                className={`${className} ${hasError ? 'border border-red-500' : ''}`}
                data-word-index={index}
                maxLength={40}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWordChange(index, e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                value={word}
              />
              {words.length > 1 && (
                <Button
                  className="color-secondary-3 h-10 rounded-full w-10 flex-shrink-0"
                  onClick={() => onRemoveWord(index)}
                  variant="icon"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          )
        })}
        {words.length < 5 && hasWord && (
          <Button
            className="flex gap-1 items-center flex-shrink-0"
            disabled={words.length >= 5}
            onClick={onAddWord}
            variant="icon"
          >
            <Plus size={16} />
          </Button>
        )}

        {/* Validation Errors - inline */}
        {validationErrors.length > 0 && (
          <div className="ml-2 text-sm color-red">
            {validationErrors[0]}
          </div>
        )}
      </div>
      {hasWord && (
        <Button className="ml-auto flex-shrink-0" onClick={onSearch} variant="outline">
          Go
        </Button>
      )}
    </div>
  )
})

SearchBar.displayName = 'SearchBar'