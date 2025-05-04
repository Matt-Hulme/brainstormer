import { HamburgerSidebar } from '@/components'

export const ProjectsList = () => {
  return (
    <div className="flex flex-row items-start min-h-screen gap-[10px]">
      <HamburgerSidebar />
      <header className="flex flex-row items-center justify-between pt-[30px] w-full">
        <span className="color-secondary-3 text-h4">AI tools for the creative minded</span>
      </header>
      <main className="pt-[90px]">
        <div className="space-y-[50px]">
          <h1 className="text-h1">Looks like you don’t have any projects (yet).</h1>
        </div>
      </main>
    </div>
  )
}
