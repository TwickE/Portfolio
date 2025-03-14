"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from 'react';
import { logInAdmin } from "@/lib/actions/admin.actions";

const Login = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [accountId, setAccountId] = useState(null);

    // Function to validate email
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!validateEmail(email)) {
            toast.error("Enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const admin = await logInAdmin({ email });

            if (!admin.accountId) {
                toast.error(admin.error);
                return;
            }

            setAccountId(admin.accountId);

            toast.success("OTP sent to your email");
        } catch {
            toast.error("Failed to login!!!!!!!!!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <main className="w-full min-h-[calc(100vh-196px)] grid place-items-center bg-light-mode-100 dark:bg-dark-mode-100 px-4 my-12">
                <div className="w-full max-w-md bg-tertiary-light dark:bg-tertiary-dark rounded-xl shadow-lg p-8 transition-all">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/assets/icons/logoLight.svg"
                            width={80}
                            height={80}
                            alt="Logo"
                            className="block dark:hidden"
                        />
                        <Image
                            src="/assets/icons/logoDark.svg"
                            width={80}
                            height={80}
                            alt="Logo"
                            className="hidden dark:block"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-center mb-2">Admin Dashboard</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Enter your email below to login to your account</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-base font-bold text-gray-700 dark:text-gray-300"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                className="w-full px-4 py-3 border border-gray-400 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none transition-all"
                            />
                        </div>
                        <Button
                            {...{ disabled: isLoading }}
                            type='submit'
                            className="w-full h-12 text-base cursor-pointer"
                        >
                            Login
                            {isLoading && <AiOutlineLoading3Quarters className="inline-block ml-2 animate-spin" />}
                        </Button>
                    </form>
                </div>
            </main>
            {accountId && <OTPModal />}
        </>
    )
}

const OTPModal = () => {
    return (
        <div className='w-96 h-96 absolute bg-red-300 top-30 left-45'>OTP Modal</div>
    )
}

export default Login