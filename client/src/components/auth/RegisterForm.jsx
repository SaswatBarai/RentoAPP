import { useState } from "react"
import { Input } from "@/components/auth/input"
import { PasswordInput } from "./PasswordInput"
import { AuthService } from "@/services/auth.service"
import { toast } from "react-toastify"
import { Bounce } from "react-toastify"
import { authStatusAtom, userDataAtom, accesTokenAtom } from "../../state/atoms/authAtoms.js";
import { useSetRecoilState } from "recoil";
import { useGoogleLogin } from "@react-oauth/google"

export const RegisterForm = ({ setIsFlipped, className = "" }) => {
    const setAuthStatus = useSetRecoilState(authStatusAtom);
    const setUserData = useSetRecoilState(userDataAtom);
    const setAccessToken = useSetRecoilState(accesTokenAtom);
    
    const [data, setData] = useState({
        email: "",
        fullname: "",
        phone: "",
        confirmPassword: "",
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

    const validateIdentifer = (value) => {
        // Email regex pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Phone regex pattern (assumes 10 digits)
        const phonePattern = /^\d{10}$/;

        if (emailPattern.test(value)) {
            return {
                isValid: true,
                type: "email"
            }
        }
        else if (phonePattern.test(value)) {
            return {
                isValid: true,
                type: "phone"
            }
        }
        return {
            isValid: false,
            type: null
        }
    }

    const handleSubmit =async  (e) => {
        e.preventDefault();
        console.log("Submitted");
        

        for (const key in data) {
            if (!data[key]) {
                toast.error(`Please enter your ${key}`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                return;
            }
        };
        const { isValid } = validateIdentifer(data.email);
        if (!isValid) {
            toast.error('Please enter a valid email', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }
        if (data.password.length < 6) {
            toast.error('Your password must be at least 6 characters long', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }
        if (data.password.length > 20) {
            toast.error('Your password must be at most 20 characters long', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast.error('Your password and confirm password must be equal', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        const userdata = {
            email: data.email,
            fullname: data.fullname,
            phone: data.phone,
            password: data.password,
        }
        const result = await AuthService.register(userdata);
        console.log(result.data);
        
        if (!result.success) {
            toast.error(result.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            result;
        }
        
        if (result.success) {
            setAuthStatus(true);
            setAccessToken(result.accessToken)
            setUserData(result.data.user)
            console.log("done");
            
            toast.success('Registration successful', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });


        }

    }
    const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      await AuthService.loginWithGoogle(response["access_token"]);
    },
    onError: (error) => {
      toast.error("Google login failed", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      console.error("Google login error:", error);
    },
    flow: "implicit",
  });

    return (
        <div className={`flex-1 flex flex-col justify-center items-center p-8 ${className}`}>
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-500">
                        Register Now
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
                    <Input
                        type="text"
                        name="fullname"
                        value={data.fullname}
                        onChange={handleChange}
                        placeholder="Enter Your Full Name"
                    />
                    <Input
                        type="text"
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        placeholder="Enter Your Phone Number"
                    />
                    <PasswordInput
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Enter Your Password"
                    />
                    <PasswordInput
                        name="confirmPassword"
                        value={data.confirmPassword}
                        onChange={handleChange}
                        placeholder="Enter Your Confirm Password"
                    />

                    <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                        Register
                    </button>
                    <div>

                        <div className="flex items-center justify-between text-sm">
                            <p className="text-gray-500">Already have an account?</p>
                            <button
                                type="button"
                                className="text-blue-500 font-semibold hover:text-blue-600"
                                onClick={() => setIsFlipped(prev => !prev)}
                            >
                                Login
                            </button>
                        </div>
                    </div>

                    {/* Google Authentication Button */}
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="m-3">OR</h1>
                        <button type="button" className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition-colors" onClick={()=> googleLogin()}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                            Continue with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}