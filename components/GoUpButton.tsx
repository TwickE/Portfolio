"use client";

import { useCallback, useEffect, useState } from 'react'
import { FaArrowUp } from "react-icons/fa";

function GoUpButton() {
    const [fillAmount, setFillAmount] = useState(0)
    const maxFillAmount = 307.919;

    const updateFillAmount = useCallback(() => {
        try {
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            const winHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            const scrollableHeight = docHeight - winHeight;
            const scrollPercentage = scrollTop / scrollableHeight;
            const newFillAmount = scrollPercentage * maxFillAmount;
            setFillAmount(newFillAmount);
        } catch (error) {
            console.error('Error updating fill amount:', error);
        }
    }, [maxFillAmount]);

    useEffect(() => {
        window.addEventListener('scroll', updateFillAmount);
        return () => {
            window.removeEventListener('scroll', updateFillAmount);
        };
    }, [updateFillAmount]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            className={`${fillAmount > 0 ? 'opacity-100 visible' : ''} block fixed right-12 bottom-12 max-xl:right-6 max-xl:bottom-6 w-[46px] h-[46px] rounded-full z-10 shadow-[inset_0_0_0_2px_var(--my-go-up1)] bg-transparent opacity-0 invisible cursor-pointer transition-all duration-300 ease-linear`}
            onClick={scrollToTop}
        >
            <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                <path className='fill-none' stroke='var(--my-go-up2)' strokeWidth='4' d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ strokeDasharray: maxFillAmount, strokeDashoffset: -fillAmount }}></path>
            </svg>
            <FaArrowUp size={26} className='absolute top-1/2 left-1/2 -translate-1/2 fill-my-go-up1' />
        </button>
    )
}

export default GoUpButton