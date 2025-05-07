import { Button } from '@/components'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  // For now, we'll use a placeholder userId until authentication is set up
  const userId = 'userId'

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row items-center justify-between p-[30px] w-full">
        <span className="color-secondary-3 text-h4">AI tools for the creative minded</span>
        <Button
          variant="outline"
          className="border-secondary-1 text-secondary-4"
          onClick={() => navigate(`/${userId}/projects`)}
        >
          Log in
        </Button>
      </div>
      <main className="flex-grow py-[70px]">
        <div className="pl-[120px] pr-[214px] space-y-[50px]">
          <header>
            <h1 className="color-secondary-4 text-h1 max-w-[804px]">
              We use AI to{' '}
              <span className="underline decoration-primary-3 decoration-8 underline-offset-[14px]">
                help you be more creative
              </span>
              , not to replace your creativity.
            </h1>
          </header>
          <div className="flex flex-row gap-[45px] pl-[118px]">
            <p className="text-h4 color-secondary-4 max-w-[582px]">
              Instead of making art or writing for you, Creaitve helps you break out of your
              creative block so you can create even better—because creativity breeds culture. When
              we lose the ability to be creative, we lose what it means to human.
            </p>
            <p className="text-p1 color-secondary-2 max-w-[356px] pt-[12px]">
              "There is no doubt that creativity is the most important human resource of all.
              Without creativity, there would be no progress, and we would be forever repeating the
              same patterns." <br />– Edward De Bono
            </p>
          </div>
        </div>
      </main>
      <footer className="pl-[320px] h-[100px] w-full">
        <div className="bg-white h-full flex flex-row items-center justify-end pr-[50px]">
          <Button
            variant="text"
            textClass="text-[25px] leading-[40px] font-serif color-secondary-4"
            onClick={() => navigate(`/${userId}/projects`)}
          >
            Give it a try
          </Button>
        </div>
      </footer>
    </div>
  )
}
