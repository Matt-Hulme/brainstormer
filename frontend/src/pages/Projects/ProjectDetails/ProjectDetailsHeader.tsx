import profilePicture from '@/assets/profile-picture.png'

export const ProjectDetailsHeader = () => {
  return (
    <header className="flex flex-row py-[30px] border-b-[.5px] border-secondary-2/20">
      <div className="grow space-y-[4px]">
        <h1 className="text-h3 text-secondary-4">Subaru - Winter is Calling (2025)</h1>
        <div className="flex flex-row items-center gap-[10px]">
          <img
            src={profilePicture}
            alt="Profile"
            className="rounded-full border-1 border-secondary-4 h-[20px] w-[20px]"
          />
          <p className="text-p3 text-secondary-2">Last edited Friday</p>
        </div>
      </div>
    </header>
  )
}
