import { ToastContainer } from 'react-toastify';

export default function AppLayout( {children} ) {
    return (
        <div className="min-h-[100dvh] bg-gray-100 flex px-2 items-center justify-center">
            <ToastContainer />
            {children}
        </div>
    )
}