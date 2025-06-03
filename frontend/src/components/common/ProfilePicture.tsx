import profilePicture from '@/assets/profile-picture.png'

interface ProfilePictureProps {
    onClick?: () => void
}

export const ProfilePicture = ({ onClick }: ProfilePictureProps) => {
    return (
        <div className="flex justify-center">
            <img
                alt="Profile"
                className={`rounded-full border-1 border-secondary-4 ${onClick ? 'cursor-pointer' : ''}`}
                onClick={onClick}
                src={profilePicture}
            />
        </div>
    )
} 