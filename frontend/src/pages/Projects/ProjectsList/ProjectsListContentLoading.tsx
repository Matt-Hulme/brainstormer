import { Spinner } from '@/components'

export const ProjectsListContentLoading = () => {
    return (
        <div className="flex flex-col gap-[72px] justify-center pt-[70px]">
            <header>
                <h1 className="max-w-[724px] text-h1 color-red">
                    Welcome back. <br />
                    Time to Explore.
                </h1>
            </header>
            <div className="space-y-[20px]">
                <div className="flex flex-row items-center justify-between pr-[30px]">
                    <span className="text-p3 color-secondary-2">YOUR PROJECTS</span>
                    <span className="text-p3 color-secondary-2">
                        Use the search bar above to start a new project
                    </span>
                </div>
                <div className="flex items-center justify-center h-32">
                    <Spinner size="lg" />
                </div>
            </div>
        </div>
    )
} 