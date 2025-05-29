import { Menu } from 'lucide-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './design-system/Button'
import { ProfilePicture } from './ProfilePicture'

interface HamburgerSidebarProps {
  children?: ReactNode
}

export const HamburgerSidebar = ({ children }: HamburgerSidebarProps) => {
  const navigate = useNavigate()

  return (
    <aside className="bg-background fixed flex flex-col h-screen justify-between left-0 p-[40px] pt-[35px] top-0 w-[110px] z-10">
      <div className="flex flex-col gap-y-[65px]">
        <Button
          className="color-secondary-3 rounded-md"
          onClick={() => navigate('/projects')}
          variant="icon"
        >
          <Menu size={24} />
        </Button>
        {children}
      </div>
      <ProfilePicture onClick={() => navigate('/projects')} />
    </aside>
  )
}
