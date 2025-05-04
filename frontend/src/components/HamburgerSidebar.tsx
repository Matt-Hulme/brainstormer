import { Menu } from 'lucide-react'
import { Button } from './design-system/Button'
import profilePicture from '../assets/profile-picture.png'

export const HamburgerSidebar = () => {
  return (
    <aside className="flex flex-col min-h-screen w-[110px] p-[40px] pt-[35px] justify-between">
      <Button variant="icon" className="rounded-md color-secondary-3">
        <Menu size={24} />
      </Button>
      <div className="flex justify-center">
        <img src={profilePicture} alt="Profile" className="rounded-full border-2 border-gray-200" />
      </div>
    </aside>
  )
}
