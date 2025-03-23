import { Button, TextField } from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'
import { ChangeEvent, FormEvent, useRef } from 'react'

export const Search = () => {
  const navigate = useNavigate()
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const searchTerm = formData.get('searchTerm')
    navigate(`/search?term=${encodeURIComponent(searchTerm as string)}`)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = e.target.value.trim().length === 0
    }
  }

  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-[794px] relative w-full">
        <TextField.Root
          name="searchTerm"
          placeholder='Type your project theme (i.e."storms")'
          className="h-[62px] bg-secondary-6/80 backdrop-blur-[30px]
          rounded-full text-primary-1 font-chivo text-body-large flex-grow
          focus:outline-none [&_input]:bg-transparent [&_input]:placeholder:text-secondary-7 [&_input]:outline-none [&_input]:flex-grow flex flex-row items-center [&_input]:pl-7.5 [&_input]:py-4"
          onChange={handleInputChange}
        >
          <TextField.Slot className="h-full py-1 pr-1.5">
            <Button
              ref={submitButtonRef}
              disabled={true}
              type="submit"
              aria-label="Generate ideas"
              className="bg-primary-1 h-full rounded-full px-6 transition-all duration-300 
                disabled:opacity-50 disabled:default
                enabled:hover:brightness-105"
            >
              <span className="text-body-medium text-background">GENERATE</span>
            </Button>
          </TextField.Slot>
        </TextField.Root>
      </form>
    </main>
  )
}

