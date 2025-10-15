import { ToastContainer } from 'react-toastify';

export default function AppLayout( {children} ) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <ToastContainer />
            {children}
        </div>
    )
}