import { ReactNode } from 'react'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { HamburgerSidebar } from './HamburgerSidebar'
import { SearchBar } from './SearchBar'

interface LayoutProps {
    sidebarChildren?: ReactNode
}

export const Layout = ({ sidebarChildren }: LayoutProps) => {
    const location = useLocation()
    const [searchParams] = useSearchParams()

    // Get search value from URL params
    const searchValue = searchParams.get('q') ?? ''

    return (
        <div className="flex">
            <HamburgerSidebar>{sidebarChildren}</HamburgerSidebar>
            <div className="ml-[110px] w-full min-h-screen flex flex-col">
                <SearchBar searchValue={searchValue} className="text-h3 text-secondary-4" />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    )
} 