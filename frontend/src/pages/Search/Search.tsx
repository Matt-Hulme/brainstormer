import { Root, Trigger } from '@radix-ui/react-dialog'
import { Button } from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'

export const Search = () => {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const searchTerm = formData.get('searchTerm')
    navigate(`/search?term=${encodeURIComponent(searchTerm as string)}`)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-[800px] relative">
        <input
          aria-label="Enter project theme to start brainstorming"
          name="searchTerm"
          className="w-full rounded-full bg-background px-7.5 py-3 border border-secondary-3 focus:outline-none focus:border-primary-1 text-primary-1 typography-body-large placeholder:typography-body-large"
          placeholder='Type your project theme (i.e. "storms")'
        />
        <Root>
          <Trigger asChild>
            <Button
              type="submit"
              aria-label="Generate ideas"
              className="absolute right-0 h-full top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-1 text-black rounded-full hover:bg-primary-2 w-30"
            >
              <span className="typography-body-small">GENERATE</span>
            </Button>
          </Trigger>
        </Root>
      </form>
    </main>
  )
}
