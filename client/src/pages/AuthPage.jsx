import { LoginForm } from "@/components/auth/LoginForm"
import { LogoCard } from "@/components/auth/LogoCard"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { useState } from "react"

export const AuthPage = () => {
    const [isFlipped, setIsFlipped] = useState(false)

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full md:w-4/5 lg:w-4/6 h-[600px] rounded-lg shadow-2xl relative overflow-hidden bg-white">
                <div
                    className={`flex w-full h-full transition-transform duration-700 ease-in-out ${
                        isFlipped ? 'md:translate-x-[-50%] translate-x-[-100%]'  : 'translate-x-0'
                    }`}
                >
                    <div className="min-w-full flex">
                        <LoginForm setIsFlipped={setIsFlipped} className="w-full lg:w-1/2" />
                        <LogoCard className="hidden lg:flex flex-1" />
                    </div>
                    <div className="min-w-full flex absolute left-full">
                        <RegisterForm setIsFlipped={setIsFlipped} className="w-full lg:w-1/2" />
                        <LogoCard className="hidden lg:flex flex-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}