import { AuthService } from "@/services/auth.service";
import { setAuth } from "@/state/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { Bounce } from "react-toastify";
import { toast } from "react-toastify";

export const useLogin = () => {
    const dispatch =  useDispatch();
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      localStorage("accessToken", data.accessToken);
      localStorage("user", data.user);
      dispatch(setAuth({isAuthenticated:true}))
      dispatch(setAuth({user:data.user}))

    },
    onError: (error) => {
      toast.error(error?.message || "Something Went Wrong !", {
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
    },
  });
};
