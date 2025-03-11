"use client";

import Link from 'next/link'
import Image from 'next/image';
import FilledButton from './FilledButton';
import useOpenLink from '@/hooks/useOpenLink';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
    // State to track whether the page has been scrolled
    const [scrolled, setScrolled] = useState(false);

    // Get current pathname
    const pathname = usePathname();

    // Function to determine which class to apply
    const getLinkClassName = (path: string) => {
        return pathname === path ? 'nav-selected-btn' : 'nav-hover-btn';
    };

    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            // Check if page is scrolled (more than 1px for a small threshold)
            const isScrolled = window.scrollY > 1;

            // Only update state if the value changes
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        // Add event listener
        window.addEventListener('scroll', handleScroll);

        // Call once on mount to set initial state
        handleScroll();

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]); // Depend on scrolled to prevent unnecessary state updates



    /* TODO: Add a glow at the bottom of the nav when scrolled */



    return (
        <header className={`${scrolled ? 'bg-dark-glass-bg backdrop-blur-sm sticky top-0 z-50': ''} text-xl w-full h-full text-white font-bold sticky top-0 z-50 transition-colors duration-300`}>
            <div className='flex items-center justify-between gap-5 w-[1320px] h-25 m-auto'>
                <Link href='/' className='flex items-center gap-5 no-underline'>
                    <Image
                        src="/assets/icons/logoDark.svg"
                        width={60}
                        height={60}
                        alt="Logo"
                    />
                    <p>Fred&apos;s Portfolio</p>
                </Link>
                <div className='flex items-center gap-12'>
                    <nav className='flex gap-12 text-base'>
                        <Link href="/" className={getLinkClassName('/')}>Home</Link>
                        <Link href="/about" className={getLinkClassName('/about')}>About</Link>
                        <Link href="/projects" className={getLinkClassName('/projects')}>Projects</Link>
                        <Link href="/contact" className={getLinkClassName('/contact')}>Contact</Link>
                        <span className='nav-hover-btn'>Theme</span>
                    </nav>
                    <FilledButton
                        text="Hire Me!"
                        containerClasses='px-8 py-4'
                        clickFunction={useOpenLink("https://www.linkedin.com/in/frederico-silva-727a8b21a/")}
                    />
                </div>
            </div>
        </header>
    )
}

export default Navbar