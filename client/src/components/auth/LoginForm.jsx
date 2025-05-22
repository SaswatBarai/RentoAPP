import { useState } from "react";
import { Input } from "@/components/auth/input";
import { PasswordInput } from "./PasswordInput";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogle, useLogin } from "@/queries/authQueries";


export const LoginForm = ({ setIsFlipped, className = "" }) => {
  
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });


  const {mutate: login, isPending} = useLogin();
  const {mutate:loginWithGoogle} = useGoogle();
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name, value);

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateIdentifer = (value) => {
    // Email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailPattern.test(value)) {
      return {
        isValid: true,
        type: "email",
      };
    }
    return {
      isValid: false,
      type: null,
    };
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!data.email) {
      toast.error("Please enter your email", {
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
    if (!data.password) {
      toast.error("Please enter your password", {
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
    const { isValid } = validateIdentifer(data.email);
    if (!isValid) {
      toast.error("Please enter a valid email address", {
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
    
    // Pass credentials as a single object and handle navigation in onSuccess
    login({ email: data.email, password: data.password }, {
      onSuccess: () => {
        navigate("/home");
      },
    });

  };

  // Google Login handler using @react-oauth/google
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response["access_token"];
      loginWithGoogle(accessToken, {
        onSuccess: () => {
          navigate("/home");
        }
      });
    },
    onError: (error) => {
      toast.error(error.message, {
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
    <div
      className={`flex-1 flex flex-col justify-center items-center p-8 ${className}`}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-500">Login Now</h1>
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

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            {isPending ? "Loading..":"Login"} 
          </button>
          <div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500">Don't have an account?</p>
              <button
                type="button"
                className="text-blue-500 font-semibold hover:text-blue-600"
                onClick={() => setIsFlipped((prev) => !prev)}
              >
                Register
              </button>
            </div>
          </div>

          {/* Google Authentication Button */}
          <div className="flex flex-col items-center justify-center">
            <h1 className="m-3">OR</h1>
            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition-colors"
              onClick={() => googleLogin()}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
