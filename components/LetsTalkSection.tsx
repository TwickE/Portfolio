"use client";

import Link from 'next/link';
import { FaArrowUp } from 'react-icons/fa';
import { useRef } from 'react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

const LetsTalkSection = () => {
    const text1Ref = useRef(null);
    const text1Visible = useScrollAnimation(text1Ref, 20);
    const text2Ref = useRef(null);
    const text2Visible = useScrollAnimation(text2Ref, 20);
    const text3Ref = useRef(null);
    const text3Visible = useScrollAnimation(text3Ref, 20);

    return (
        <section className='bg-my-background-200 w-full py-12 grid place-items-center'>
            <div className='flex flex-col items-center w-fit'>
                <p ref={text1Ref} className={`${text1Visible ? '!animate-fade-in-left' : 'opacity-0'} mr-auto max-md:text-base max-sm:text-sm`}>Want to know more?</p>
                <h2 ref={text2Ref} className={`${text2Visible ? '!animate-fade-in' : 'opacity-0'} text-my-primary text-[8rem] font-bold bg-transparent max-xl:text-[6rem] max-lg:text-[5rem] max-md:text-[4rem] max-sm:text-[3rem] max-sm:mr-auto`}>
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
                    ref={text3Ref}
                    href='mailto:fredericosilva2002@hotmail.com'
                    className={`${text3Visible ? '!animate-fade-in-right' : 'opacity-0'} ml-auto flex items-center gap-2 group animated-hover-link max-md:text-base max-sm:text-sm`}
                >
                    fredericosilva2002@hotmail.com
                    <FaArrowUp size={18} className="rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                </Link>
            </div>
        </section>
    )
}

export default LetsTalkSection