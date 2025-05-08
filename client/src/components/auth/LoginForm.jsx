import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { toast, ToastContainer, Bounce } from "react-toastify"

export const LoginForm = ({ setIsFlipped }) => {

    const [formData, setFormData] = useState({
        email: "",
        phone:"",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleChangeOnMain = (e)=>{
        const {value} = e.target;
        const {isValid, type} = validateIdentifer(value);
        if (!isValid || type == null) {
            toast.error('Please enter a valid email or phone number', {
                position: "top-center",
                autoClose: 4000,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        setFormData(
            (prev)  => (
                {...prev  , [type] : value}
            )
        )
    }

    const validateIdentifer = (value)=>{
         // Email regex pattern
         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         // Phone regex pattern (assumes 10 digits)
         const phonePattern = /^\d{10}$/;

         if(emailPattern.test(value)){
            return{
                isValid:true,
                type:"email"
            }
         }
         else if(phonePattern.test(value)){
            return {
                isValid:true,
                type:"phone"
            }
         }
         return{
            isValid:false,
            type:null
         }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
    }

    const handleGoogleLogin = () => {
        // TODO: Implement Google login
        console.log("Google login clicked");
    }

    return (
        <div className="w-full sm:w-[90%] md:w-2/4 bg-white flex flex-col justify-center items-center p-3 sm:p-4 gap-3 sm:gap-4 rounded-[15px] sm:rounded-[20px] md:rounded-[40px]">
          <ToastContainer />
          <div><p className="text-center text-xl sm:text-2xl md:text-[40px]">LOGIN HERE</p></div>
            <form
                onSubmit={handleSubmit}
                className="grid w-full max-w-sm gap-3 sm:gap-4 px-2 sm:px-0"
            >
                <div className="grid gap-1.5">
                    <Input
                        type="email"
                        id="emailorphone"
                        name="emailorphone"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChangeOnMain}
                        required
                    />
                </div>

                <div className="grid gap-1.5">
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    
                </div>

                <Button type="submit">Login</Button>
            </form>

            <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-sm mt-3 sm:mt-4 px-2 sm:px-0">
                <div className="flex items-center w-full">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 text-sm sm:text-base">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <Button 
                    type="button" 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                    onClick={handleGoogleLogin}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Continue with Google
                </Button>

                <p className="text-xs sm:text-sm text-gray-600">
                    New to our platform? 
                    <span 
                        onClick={() => setIsFlipped(true)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer ml-1"
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    )
}