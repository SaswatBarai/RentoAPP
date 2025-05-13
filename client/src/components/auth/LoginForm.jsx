import { useState } from "react";
import { Input } from "@/components/auth/input";
import { PasswordInput } from "./PasswordInput";
import { AuthService } from "@/services/auth.service";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  authStatusAtom,
  userDataAtom,
  accesTokenAtom,
} from "../../state/atoms/authAtoms.js";
import { useSetRecoilState } from "recoil";
import { useGoogleLogin } from "@react-oauth/google";

export const LoginForm = ({ setIsFlipped, className = "" }) => {
  const setAuthStatus = useSetRecoilState(authStatusAtom);
  const setUserData = useSetRecoilState(userDataAtom);
  const setAccessToken = useSetRecoilState(accesTokenAtom);

  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

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

    const result = await AuthService.login(data.email, data.password);
    console.log(result.success);
    
    if (result.success) {
      setAuthStatus(true);
      setAccessToken(result.accessToken);
      setUserData(result.data.user);
      toast.success("Login successful", {
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
      navigate("/home");
    } else {
      toast.error("Login failed", {
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
  };

  // Google Login handler using @react-oauth/google
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const accessToken = response["access_token"];
        console.log("Google access token:", response);
        
        if (!accessToken) {
          toast.error("Failed to get access token from Google", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          return;
        }
        
        const result = await AuthService.loginWithGoogle(accessToken);
        console.log("Login result:", result);
        
        if (result && result.success) {
          setAuthStatus(true);
          setAccessToken(result.accessToken);
          setUserData(result.data.user);
          toast.success("Google login successful", {
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
          navigate("/home");
        } else {
          toast.error(result.message || "Google login failed", {
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
      } catch (error) {
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
      }
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

          <button className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Login
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
