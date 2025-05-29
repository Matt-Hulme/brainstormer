import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { HamburgerSidebar } from './HamburgerSidebar'

interface LayoutProps {
    sidebarChildren?: ReactNode
}

export const Layout = ({ sidebarChildren }: LayoutProps) => {
    return (
        <div className="flex">
            <HamburgerSidebar>{sidebarChildren}</HamburgerSidebar>
            <main className="ml-[110px] w-full min-h-screen">
                <Outlet />
            </main>
        </div>
    )
} 