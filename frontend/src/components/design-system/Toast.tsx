import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const Toast = () => {
    return (
        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="flex flex-col w-fit"
            toastClassName="bg-primary-3 whitespace-nowrap"
            bodyClassName="color-secondary-5 text-p1"
            progressClassName="bg-primary"
        />
    )
}

export const showUndevelopedFeatureToast = () => {
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