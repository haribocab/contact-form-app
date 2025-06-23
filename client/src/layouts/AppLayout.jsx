export default function AppLayout( {children} ) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-xl border border-gray-200 bg-primary">
                {children}
            </div>
        </div>
    )
}