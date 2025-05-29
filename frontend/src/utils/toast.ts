import { toast } from 'react-toastify'

export const showToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),

    undevelopedFeature: () => {
        toast.info('Whoa, you found an undeveloped feature! It\'s not quite ready for prime-time, but stay tuned.', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: false,
        })
    }
}

// For backward compatibility, export the specific function
export const showUndevelopedFeatureToast = showToast.undevelopedFeature 