import { ReactNode, createContext, useContext, useRef } from 'react'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { HamburgerSidebar } from './HamburgerSidebar'
import { SearchBar, SearchBarRef } from './SearchBar'

interface LayoutProps {
    sidebarChildren?: ReactNode
}

interface SearchBarContextType {
    focusSearchBar: () => void
    clearAndFocusSearchBar: () => void
}

const SearchBarContext = createContext<SearchBarContextType | undefined>(undefined)

export const useSearchBarContext = () => {
    const context = useContext(SearchBarContext)
    if (!context) {
        throw new Error('useSearchBarContext must be used within a Layout component')
    }
    return context
}

export const Layout = ({ sidebarChildren }: LayoutProps) => {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const searchBarRef = useRef<SearchBarRef>(null)

    // Get search value from URL params
    const searchValue = searchParams.get('q') ?? ''

    const contextValue: SearchBarContextType = {
        focusSearchBar: () => {
            searchBarRef.current?.focus()
        },
        clearAndFocusSearchBar: () => {
            searchBarRef.current?.clear()
            searchBarRef.current?.focus()
        }
    }

    return (
        <SearchBarContext.Provider value={contextValue}>
            <div className="flex">
                <HamburgerSidebar>{sidebarChildren}</HamburgerSidebar>
                <div className="ml-[110px] w-full min-h-screen flex flex-col">
                    <SearchBar ref={searchBarRef} searchValue={searchValue} className="text-h3 text-secondary-4" />
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SearchBarContext.Provider>
    )
} 