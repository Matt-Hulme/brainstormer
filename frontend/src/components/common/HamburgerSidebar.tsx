import { ArrowLeft, Menu } from 'lucide-react'
import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { showUndevelopedFeatureToast } from '@/utils/toast'
import { Button } from '../designSystem'
import { ProfilePicture } from './ProfilePicture'

interface HamburgerSidebarProps {
  children?: ReactNode
}

export const HamburgerSidebar = ({ children }: HamburgerSidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isProjectsListPage = location.pathname === '/projects'

  const handleMainButtonClick = () => {
    if (isProjectsListPage) {
      showUndevelopedFeatureToast()
    } else {
      const isSearchPage = location.pathname.includes('/search')

      if (isSearchPage) {
        navigate('/projects')
      } else {
        navigate(-1)
      }
    }
  }

  return (
    <aside className="bg-background fixed flex flex-col h-screen justify-between left-0 p-[40px] pt-[30px] top-0 w-[110px] z-10">
      <div className="flex flex-col gap-y-[65px]">
        <Button
          className="color-secondary-3 rounded-md"
          onClick={handleMainButtonClick}
          variant="icon"
        >
          {isProjectsListPage ? (
            <Menu size={24} />
          ) : (
            <ArrowLeft size={24} />
          )}
        </Button>
        {children}
      </div>
      <ProfilePicture onClick={() => navigate('/projects')} />
    </aside>
  )
}
