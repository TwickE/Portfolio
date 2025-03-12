"use client";

import Link from 'next/link'
import Image from 'next/image';
import FilledButton from './FilledButton';
import useOpenLink from '@/hooks/useOpenLink';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaChevronDown } from "react-icons/fa";
import { CgDarkMode } from "react-icons/cg";

const Navbar = () => {
    // State to track whether the page has been scrolled
    const [scrolled, setScrolled] = useState(false);

    // State to track the active theme
    const [activeTheme, setActiveTheme] = useState(localStorage.activeTheme || 'system');

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

    // Apply theme based on activeTheme
    useEffect(() => {
        // Save active theme to local storage
        if (activeTheme === 'system') {
            localStorage.removeItem('activeTheme');
        } else {
            localStorage.setItem('activeTheme', activeTheme);
        }

        // Function to apply theme
        const applyTheme = () => {
            const isDark =
                activeTheme === 'dark' ||
                (activeTheme === 'system' && window.matchMedia("(prefers-color-scheme: dark)").matches);

            document.documentElement.classList.toggle("dark", isDark);
        };

        applyTheme();

        // Apply theme on activeTheme state change
        if (activeTheme === 'system') {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

            const handleSystemThemeChange = (e: MediaQueryListEvent) => {
                document.documentElement.classList.toggle("dark", e.matches);
            };

            mediaQuery.addEventListener("change", handleSystemThemeChange);
            return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
        }
    }, [activeTheme]);

    return (
        <header className={`${scrolled ? 'bg-light-glass-bg dark:bg-dark-glass-bg shadow-[0_0_30px_3px_rgba(40,58,255,0.25)] backdrop-blur-sm sticky top-0 z-50' : ''} text-xl w-full h-full text-black dark:text-white font-bold sticky top-0 z-50 transition-colors duration-300`}>
            <div className='flex items-center justify-between gap-5 w-[1320px] h-25 m-auto'>
                <Link href='/' className='flex items-center gap-5 no-underline'>
                    <Image
                        src="/assets/icons/logoLight.svg"
                        width={60}
                        height={60}
                        alt="Logo Light"
                        className="block dark:hidden"
                    />
                    <Image
                        src="/assets/icons/logoDark.svg"
                        width={60}
                        height={60}
                        alt="Logo dark"
                        className="hidden dark:block"
                    />
                    <p>Fred&apos;s Portfolio</p>
                </Link>
                <div className='flex items-center gap-12'>
                    <nav className='flex gap-12 text-base'>
                        <Link href="/" className={getLinkClassName('/')}>Home</Link>
                        <Link href="/about" className={getLinkClassName('/about')}>About</Link>
                        <Link href="/projects" className={getLinkClassName('/projects')}>Projects</Link>
                        <Link href="/contact" className={getLinkClassName('/contact')}>Contact</Link>
                        <div className='nav-hover-btn relative group'>
                            <div className='flex items-center gap-2 cursor-pointer'>
                                <p>Theme</p>
                                <FaChevronDown size={16} className='group-hover:rotate-180 transition-transform duration-600' />
                            </div>
                            <span className='absolute inset-x-0 h-[38px] top-full' />{/* Invisible hover extender */}
                            <ul className='absolute top-[62px] flex flex-col gap-1 left-0 bg-light-mode-100 dark:bg-dark-mode-100 rounded-md p-1 scale-y-0 origin-top opacity-0 group-hover:scale-y-100 group-hover:opacity-100 transition-[transform,opacity,scale] duration-600 shadow-[0_0_20px_rgba(40,58,255,0.5)]'>
                                <li className={`${activeTheme === 'light' ? 'bg-primary text-white' : 'hover:bg-secondary/50'} flex gap-2 py-2 pl-2 pr-12 rounded-xs cursor-pointer transition-[background]`} onClick={() => setActiveTheme('light')}>
                                    <FaSun size={20} />
                                    <p>Light</p>
                                </li>
                                <li className={`${activeTheme === 'dark' ? 'bg-primary text-white' : 'hover:bg-secondary/50'} flex gap-2 py-2 pl-2 pr-12 rounded-xs cursor-pointer transition-[background]`} onClick={() => setActiveTheme('dark')}>
                                    <FaMoon size={20} />
                                    <p>Dark</p>
                                </li>
                                <li className={`${activeTheme === 'system' ? 'bg-primary text-white' : 'hover:bg-secondary/50'} flex gap-2 py-2 pl-2 pr-12 rounded-xs cursor-pointer transition-[background]`} onClick={() => setActiveTheme('system')}>
                                    <CgDarkMode size={20} />
                                    <p>System</p>
                                </li>
                            </ul>
                        </div>
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