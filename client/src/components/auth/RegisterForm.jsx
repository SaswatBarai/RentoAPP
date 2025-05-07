import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { toast, ToastContainer, Bounce } from "react-toastify"

export const RegisterForm = () => {

    const [formData, setFormData] = useState({
        email: "",
        fullname: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("hello");
        
        if (formData.confirmPassword !== formData.password) {
            toast.error('Passwords do not match!', {
                position: "top-center",
                autoClose: 4000,
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
    }

    return (
        <div className="w-2/4 flex flex-col justify-center items-center">
          <ToastContainer />
          <div><p className="text-center">LOGIN HERE</p></div>
            <form
                onSubmit={handleSubmit}
                className="grid w-full max-w-sm gap-4"
            >
                <div className="grid gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                        type="text"
                        id="fullname"
                        name="fullname"
                        placeholder="Enter your full name"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
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

                <div className="grid gap-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Button type="submit">Register</Button>

            </form>

        </div>
    )
}