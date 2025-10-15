import BackgroundImageUrl from '../images/background.webp';
import { ToastContainer } from 'react-toastify';

export default function AppLayout( {children} ) {
    return (
        <div 
            className="min-h-screen bg-gray-100 flex items-center justify-center"
            style={{ 
                backgroundImage: `url(${BackgroundImageUrl})`,
                backgroundSize: `cover`
             }}
         >
            <ToastContainer />
            {children}
        </div>
    )
}