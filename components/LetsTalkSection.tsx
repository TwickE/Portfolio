import Link from 'next/link'
import { FaArrowUp } from 'react-icons/fa'

const LetsTalkSection = () => {
    return (
        <section className='bg-my-background-200 w-full py-12 grid place-items-center'>
            <div className='flex flex-col items-center w-fit'>
                <p className='mr-auto max-md:text-base max-sm:text-sm'>Want to know more?</p>
                <h2 className='text-my-primary text-[8rem] font-bold bg-transparent max-xl:text-[6rem] max-lg:text-[5rem] max-md:text-[4rem] max-sm:text-[3rem] max-sm:mr-auto'>
                    <span className='inline-block animate-ripple-text'>L</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.05s" }}>e</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.10s" }}>t</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.15s" }}>&apos;</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.20s" }}>s</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.25s" }}>&nbsp;</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.30s" }}>T</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.35s" }}>a</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.40s" }}>l</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.45s" }}>k</span>
                    <span className='inline-block animate-ripple-text' style={{ animationDelay: "0.50s" }}>!</span>
                </h2>
                <Link
                    href='mailto:fredericosilva2002@hotmail.com'
                    className='ml-auto flex items-center gap-2 group breadcrumbs-hover-link max-md:text-base max-sm:text-sm'
                >
                    fredericosilva2002@hotmail.com
                    <FaArrowUp size={18} className="rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                </Link>
            </div>

        </section>
    )
}

export default LetsTalkSection