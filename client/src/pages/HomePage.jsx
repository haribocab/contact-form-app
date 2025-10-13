import AppLayout from '../layouts/AppLayout';
import { Link } from 'react-router-dom';


export default function HomePage() {
    return (
        <AppLayout>
            <div className="bg-white flex flex-col items-center justify-center w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h1 className="text-dark text-5xl font-extrabold mb-8">
                    Messages App
                </h1>
                <p className="text-dark text-lg mb-12 max-w-lg text-center">
                    Please login to access your chat board and manage your data securely.
                </p>
                <Link
                    to="/login"
                    className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
                >
                    Go to Login
                </Link>
            </div>
        </AppLayout>
    )
}