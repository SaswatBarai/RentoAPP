import { AuthService } from "@/services/auth.service";
import { setAuth } from "@/state/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { Bounce } from "react-toastify";
import { toast } from "react-toastify";

export const useLogin = () => {
  const dispatch = useDispatch();
  return useMutation({

    mutationFn: (credentials) =>
      AuthService.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      console.log(data);

      localStorage.setItem("accessToken", data.accessToken);
      Cookies.set("accessToken",data.accessToken)
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(setAuth({ isAuthenticated: true }));
      dispatch(setAuth({ user: data.user }));
    },
    onError: (error) => {
      console.log(error);

      toast.error(error?.response?.data?.message|| "Something Went Wrong!", {
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
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: (userdata) => AuthService.register(userdata),
    onError: (error) => {
      // Extract custom error message from the backend
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong during registration.";

      toast.error(errorMessage, {
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

      console.error("Registration error:", errorMessage);
    },
  });
};

export const useGoogle = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (accessToken) => AuthService.loginWithGoogle(accessToken),
    onSuccess: (data) => {
      if (!data || !data.success) {
        throw new Error(data?.message || "Google login failed");
      }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(setAuth({ isAuthenticated: true }));
      dispatch(setAuth({ user: data.user }));
    },
    onError: (error) => {
      toast.error(error?.message || "Something Went Wrong!", {
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
    },
  });
};
