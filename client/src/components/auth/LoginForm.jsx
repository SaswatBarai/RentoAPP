import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { toast, ToastContainer, Bounce } from "react-toastify"

export const LoginForm = () => {

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

    return (
        <div className="w-2/4 bg-green-400 flex flex-col justify-center items-center ">
          <ToastContainer />
          <div><p className="text-center">LOGIN HERE</p></div>
            <form
                onSubmit={handleSubmit}
                className="grid w-full max-w-sm gap-4"
            >
                <div className="grid gap-1.5">
                    <Label htmlFor="email"></Label>
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
                    <Label htmlFor="password">Password</Label>
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

        </div>
    )
}