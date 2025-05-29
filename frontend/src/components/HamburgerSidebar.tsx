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
    <aside className="flex flex-col min-h-screen w-[110px] p-[40px] pt-[35px] justify-between">
      <div className="flex flex-col gap-y-[65px]">
        <Button
          className="rounded-md color-secondary-3"
          onClick={() => navigate('/')}
          variant="icon"
        >
          <Menu size={24} />
        </Button>
        {children}
      </div>
      <ProfilePicture onClick={() => navigate('/')} />
    </aside>
  )
}
