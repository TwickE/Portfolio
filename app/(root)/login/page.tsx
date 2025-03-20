"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from 'react';
import { logInAdmin } from "@/lib/actions/admin.actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/input-otp";
import { verifySecret, sendEmailOTP } from "@/lib/actions/admin.actions";
import { useRouter } from "next/navigation";

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
        } catch {
            toast.error("Failed to login");
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
                            src="/icons/logoLight.svg"
                            width={80}
                            height={80}
                            alt="Logo"
                            className="block dark:hidden"
                        />
                        <Image
                            src="/icons/logoDark.svg"
                            width={80}
                            height={80}
                            alt="Logo"
                            className="hidden dark:block"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-center mb-2">Admin Dashboard</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Enter your email below to login to your account</p>
                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-base font-bold text-gray-700 dark:text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="m@example.com"
                            className="w-full px-4 py-3 mb-8 border border-gray-400 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none transition-all"
                        />
                        <Button
                            disabled={isLoading}
                            type='submit'
                            className="w-full h-12 text-base cursor-pointer"
                        >
                            Login
                            {isLoading && <AiOutlineLoading3Quarters className="inline-block ml-2 animate-spin" />}
                        </Button>
                    </form>
                </div>
            </main>
            {accountId && <OTPModal email={email} accountId={accountId} />}
        </>
    )
}

const OTPModal = ({ accountId, email }: { accountId: string, email: string }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const sessionId = await verifySecret({ accountId, password });
            if (sessionId) {
                router.push("/admin");
            }
        } catch (error) {
            console.log("Failed to verify OTP", error);
            toast.error("Failed to verify OTP");
            setIsLoading(false);
        }
    }

    const handleResendOTP = async () => {
        await sendEmailOTP({ email });
        toast.success("A new OTP has been sent to your email");
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="space-y-4 max-w-[95%] sm:w-fit rounded-xl md:rounded-[30px] px-4 md:px-8 py-10 bg-tertiary-light dark:bg-tertiary-dark border-secondary outline-none">
                <AlertDialogHeader className="relative flex justify-center">
                    <AlertDialogTitle className="text-center text-2xl font-bold">
                        Enter your OTP
                        <IoIosCloseCircleOutline
                            size={20}
                            onClick={() => setIsOpen(false)}
                            className='absolute -right-1 -top-7 cursor-pointer sm:-right-2 sm:-top-4'
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-center text-light-100">
                        We&apos;ve sent an OTP code to <span className="pl-1 text-primary">{email}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={password} onChange={setPassword}>
                    <InputOTPGroup className="w-full flex gap-1 sm:gap-2 justify-between">
                        <InputOTPSlot index={0} className="otp-slot" />
                        <InputOTPSlot index={1} className="otp-slot" />
                        <InputOTPSlot index={2} className="otp-slot" />
                        <InputOTPSlot index={3} className="otp-slot" />
                        <InputOTPSlot index={4} className="otp-slot" />
                        <InputOTPSlot index={5} className="otp-slot" />
                    </InputOTPGroup>
                </InputOTP>
                <AlertDialogFooter>
                    <div className="flex w-full flex-col gap-4">
                        <AlertDialogAction onClick={handleSubmit} className="w-full h-12 text-base text-white cursor-pointer" type="button" disabled={isLoading}>
                            Submit
                            {isLoading && <AiOutlineLoading3Quarters className="inline-block ml-2 animate-spin" />}
                        </AlertDialogAction>
                        <div className="text-base mt-2 text-center">
                            Didn&apos;t recive a code?
                            <Button
                                type="button"
                                variant="link"
                                className="pl-1 text-primary cursor-pointer"
                                onClick={handleResendOTP}
                            >
                                Click to resend OTP
                            </Button>
                        </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Login