export const LogoCard = ({ className }) => {
    return (
        <div className={`flex-1 bg-blue-500 flex flex-col items-center justify-center text-white p-8 ${className}`}>
            <div className="space-y-6 text-center">
                <h1 className="text-4xl font-bold">Welcome to Rento</h1>
                <p className="text-lg text-blue-100">Your one-stop solution for all rental needs</p>
                <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
            </div>
        </div>
    )
}