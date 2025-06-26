import AppLayout from '../layouts/AppLayout';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <AppLayout>
            <div className="bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h1 className="text-white text-5xl font-extrabold mb-8 drop-shadow-lg">
                    Login Chat App
                </h1>
                <p className="text-white text-lg mb-12 max-w-lg text-center drop-shadow-md">
                    Please login to access your chat board and manage your data securely.
                </p>
                <Link
                    to="/login"
                    className="px-8 py-4 bg-white text-green-600 font-semibold rounded-lg shadow-lg hover:bg-green-100 transition"
                >
                    Go to Login
                </Link>
            </div>
        </AppLayout>
    )
}