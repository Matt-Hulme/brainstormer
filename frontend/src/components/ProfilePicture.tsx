import { showUndevelopedFeatureToast } from '@/components'
import profilePicture from '../assets/profile-picture.png'

export const ProfilePicture = () => {
    return (
        <div className="flex justify-center">
            <img
                alt="Profile"
                className="cursor-pointer rounded-full border-1 border-secondary-4"
                onClick={showUndevelopedFeatureToast}
                src={profilePicture}
            />
        </div>
    )
} 