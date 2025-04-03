import { ContactBadgeProps } from '@/types/interfaces'
import Link from 'next/link'
import { FaEnvelope, FaLinkedin, FaGithub, FaCodepen } from 'react-icons/fa'

const ContactSection = () => {
    return (
        <section className="flex flex-col items-center w-full py-12">
            <div className="flex flex-col items-center responsive-container">
                <h2 className="section-title mb-8">My Contacts</h2>
                <div className='w-full flex items-center gap-5 max-3xl:flex-col'>
                    <div className='flex flex-1/2 flex-col items-center justify-center gap-10 max-3xl:gap-8 max-3xl:w-full max-3xl:order-last'>
                        <form className='bg-my-accent w-full rounded-2xl p-10'>
                            <h2 className='text-4xl font-bold w-fit text-gradient mb-4'>Let&apos;s Talk!</h2>
                            <p className='text-base mb-12'>I design and code beautifully simple things and i love what i do. Just simple like that!</p>
                            <div className='grid grid-cols-2 gap-4 mb-2'>
                                <input
                                    type="text"
                                    placeholder='First Name'
                                    /* value={}
                                    onChange={} */
                                    className='py-3 px-5 bg-my-background-200 border rounded-md text-base outline-none focus:border-my-primary transition-all duration-300'
                                />
                                <input
                                    type="text"
                                    placeholder='Last Name'
                                    /* value={}
                                    onChange={} */
                                    className='py-3 px-5 bg-my-background-200 border rounded-md text-base outline-none focus:border-my-primary transition-all duration-300'
                                />
                                <input
                                    type="text"
                                    placeholder='Email Address'
                                    /* value={}
                                    onChange={} */
                                    className='py-3 px-5 bg-my-background-200 border rounded-md text-base outline-none focus:border-my-primary transition-all duration-300'
                                />
                                <input
                                    type="text"
                                    placeholder='Phone Number'
                                    /* value={}
                                    onChange={} */
                                    className='py-3 px-5 bg-my-background-200 border rounded-md text-base outline-none focus:border-my-primary transition-all duration-300'
                                />
                                <textarea
                                    placeholder='Message'
                                    /* value={}
                                    onChange={} */
                                    className='col-span-2 min-h-50 px-5 py-3 bg-my-background-200 border rounded-md text-base outline-none focus:border-my-primary transition-all duration-300'
                                />
                            </div>

                        </form>
                    </div>
                    <div className='flex flex-1/2 flex-col items-center justify-center max-auto max-3xl:gap-8 max-3xl:order-first'>
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
        <Link href={link} target="_blank" rel="noopener,noreferrer" className='flex items-center gap-6 group'>
            <span className='w-15 h-15 grid place-items-center rounded-full bg-linear-to-r from-my-primary to-my-secondary group-hover:scale-125 group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-transform duration-300'>
                {icon}
            </span>
            <div className='flex flex-col gap-1 text-base font-normal group-hover:text-my-primary transition-colors duration-300'>
                <h6>{title}</h6>
                <h4 className='text-xl font-bold'>{text}</h4>
            </div>
        </Link>
    )
}