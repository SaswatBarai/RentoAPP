import { useState } from "react"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "./PasswordInput"

export const LoginForm = ({setIsFlipped, className = ""}) => {
    const [data,setData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        console.log(name, value);
        
        setData(prev => ({
            ...prev,
            [name]: value
            
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
    }

    return(
        <div className={`flex-1 flex flex-col justify-center items-center p-8 ${className}`}>
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-500">
                        Login Now
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        type="email" 
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        placeholder="Enter Your Email"  
                    />
                    <PasswordInput
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Enter Your Password"
                    />
                   
                    <button className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                        Login
                    </button>
                    <div>
                        
                        <div className="flex items-center justify-between text-sm">
                            <p className="text-gray-500">Don't have an account?</p>
                            <button 
                                type="button"
                                className="text-blue-500 font-semibold hover:text-blue-600" 
                                onClick={() => setIsFlipped(prev => !prev)}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                     {/* Google Authentication Button */}
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="m-3">OR</h1>
                        <button type="button" className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition-colors">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                            Continue with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}