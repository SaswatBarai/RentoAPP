import { LoginForm } from "@/components/auth/LoginForm"
import { RegisterForm } from "@/components/auth/RegisterForm"

export const AuthPage = () => {
    return (
        <>
        <div className="h-screen w-full flex justify-center items-center">
            <div
            id="main-div"
            className="bg-amber-500 w-4/6 h-5/6 flex justify-center"
            >
               <RegisterForm/>
               <LoginForm/>
            </div>
        </div>
        </>
    )
}