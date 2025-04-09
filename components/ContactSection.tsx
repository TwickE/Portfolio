"use client";

import { ContactBadgeProps } from '@/types/interfaces'
import Link from 'next/link'
import { FaEnvelope, FaLinkedin, FaGithub, FaCodepen } from 'react-icons/fa'
import FilledButton from './FilledButton'
import { useState } from 'react'
import { toast } from 'sonner'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ContactSection = ({backgroundColor}: {backgroundColor: string}) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
    });
    const [isSending, setIsSending] = useState(false);

    const verifyFields = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
            toast.error("Please fill in all fields.")
            return true;
        }

        if(!formData.email.includes("@") || !formData.email.includes(".")) {
            toast.error("Please enter a valid email address.")
            return true;
        }
    }

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const isValid = verifyFields()
            if (isValid) return;

            console.log("cheguei");

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: process.env.NEXT_PUBLIC_WEB3FORMS_API_KEY,
                    "Subject": "New Message from Portfolio Contact Form",
                    "First Name": formData.firstName,
                    "Last Name": formData.lastName,
                    "Email": formData.email,
                    "Phone Number": formData.phone,
                    "Message": formData.message,
                }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Message sent successfully!")
            } else {
                toast.error("Failed to send message. Please try again later.")
            }
        } catch {
            toast.error("Failed to send message. Please try again later.")
        } finally {
            setIsSending(false);
        }
    }

    return (
        <section className={`${backgroundColor} flex flex-col items-center w-full py-12`}>
            <div className="flex flex-col items-center responsive-container">
                <h2 className="section-title mb-8">My Contacts</h2>
                <div className='w-full flex items-center gap-5 max-3xl:flex-col max-3xl:gap-12'>
                    <div className='flex flex-1/2 flex-col items-center justify-center gap-10 max-3xl:gap-8 max-3xl:w-full max-3xl:order-last'>
                        <form onSubmit={handleSendMessage} className='bg-my-accent w-full rounded-2xl p-10 max-lg:p-5'>
                            <h2 className='text-4xl font-bold w-fit text-gradient mb-4'>Let&apos;s Talk!</h2>
                            <p className='text-base mb-12'>I design and code beautifully simple things and I love what I do. Just simple like that!</p>
                            <div className='grid grid-cols-2 gap-x-4'>
                                <input
                                    type="text"
                                    placeholder='First Name'
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className='max-lg:col-span-2 form-input'
                                />
                                <input
                                    type="text"
                                    placeholder='Last Name'
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className='max-lg:col-span-2 form-input'
                                />
                                <input
                                    type="text"
                                    placeholder='Email Address'
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className='max-lg:col-span-2 form-input'
                                />
                                <input
                                    type="text"
                                    placeholder='Phone Number'
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className='max-lg:col-span-2 form-input'
                                />
                                <textarea
                                    placeholder='Message'
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className='col-span-2 min-h-50 form-input'
                                />
                            </div>
                            <FilledButton
                                text={isSending ? "Sending..." : "Send Message"}
                                icon={isSending ? <AiOutlineLoading3Quarters className='animate-spin' /> : <></> }
                                containerClasses='flex items-center gap-2 px-8 py-4'
                                disabled={isSending ? true : false}
                            />
                        </form>
                    </div>
                    <div className='flex flex-1/2 flex-col justify-center items-center mx-auto max-3xl:order-first'>
                        <div className='flex flex-col gap-10'>
                            <ContactBadge
                                link="mailto: fredericosilva2002@hotmail.com"
                                icon={<FaEnvelope size={30} color='white' />}
                                title="Email"
                                text="fredericosilva2002@hotmail.com"
                            />
                            <ContactBadge
                                link="https://www.linkedin.com/in/frederico-silva-727a8b21a/"
                                icon={<FaLinkedin size={30} color='white' />}
                                title="LinkedIn"
                                text="Frederico Silva"
                            />
                            <ContactBadge
                                link="https://github.com/TwickE"
                                icon={<FaGithub size={30} color='white' />}
                                title="Github"
                                text="@TwickE"
                            />
                            <ContactBadge
                                link="https://codepen.io/TwickE"
                                icon={<FaCodepen size={30} color='white' />}
                                title="CodePen"
                                text="@TwickE"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSection

const ContactBadge = ({ link, icon, title, text }: ContactBadgeProps) => {
    return (
        <Link href={link} target="_blank" rel="noopener,noreferrer" className='flex items-center gap-6 group max-lg:gap-3'>
            <span className='flex-shrink-0 w-15 h-15 grid place-items-center rounded-full bg-linear-to-r from-my-primary to-my-secondary group-hover:scale-125 group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-transform duration-300'>
                {icon}
            </span>
            <div className='flex flex-col gap-1 group-hover:text-my-primary transition-colors duration-300'>
                <h6 className='text-base max-lg:text-sm font-normal'>{title}</h6>
                <h4 className='text-xl max-lg:text-base font-bold break-all'>{text}</h4>
            </div>
        </Link>
    )
}