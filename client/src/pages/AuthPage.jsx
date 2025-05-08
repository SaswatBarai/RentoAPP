import { LoginForm } from "@/components/auth/LoginForm"
import LogoCard from "@/components/auth/LogoCard"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { useState } from "react"

export const AuthPage = () => {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <div className="min-h-screen w-full flex justify-center items-center p-2 sm:p-4">
            <div
                id="main-div"
                className="bg-amber-500 w-full md:w-4/6 min-h-[500px] flex justify-center shadow-2xl rounded-[20px] md:rounded-[40px] relative overflow-hidden"
            >
                <div 
                    className="flex w-full transition-transform duration-700 ease-in-out relative"
                    style={{ transform: isFlipped ? 'translateX(-50%)' : 'translateX(0)', touchAction: 'pan-y pinch-zoom' }}
                >
                    <div className="min-w-full flex justify-center">
                        <LoginForm setIsFlipped={setIsFlipped} />
                        <LogoCard className="hidden md:flex" />
                    </div>
                    <div className="min-w-full flex justify-center absolute left-full">
                        <RegisterForm setIsFlipped={setIsFlipped} />
                        <LogoCard className="hidden md:flex" />
                    </div>
                </div>
            </div>
        </div>
    )
}