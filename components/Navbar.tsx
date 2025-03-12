"use client";

import Link from 'next/link'
import Image from 'next/image';
import FilledButton from './FilledButton';
import useOpenLink from '@/hooks/useOpenLink';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaSun, FaMoon, FaChevronDown } from "react-icons/fa";
import { CgDarkMode, CgMenuRight } from "react-icons/cg";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { VisuallyHidden } from "radix-ui";
import { ThemeToggleProps } from '@/types/interfaces';

const Navbar = () => {
    // State to track whether the page has been scrolled
    const [scrolled, setScrolled] = useState(false);
    // State to track the active theme
    const [activeTheme, setActiveTheme] = useState(localStorage.activeTheme || 'system');

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
            <div className='flex items-center justify-between w-[1320px] h-25 m-auto max-5xl:w-[1140px] max-4xl:w-[960px] max-3xl:w-[800px] max-2xl:w-[700px] max-xl:w-[540px] max-lg:w-full max-lg:px-3'>
                <Link href='/' className='flex items-center gap-5 no-underline max-4xl:gap-2'>
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
                    <p className='max-3xl:hidden'>Fred&apos;s Portfolio</p>
                </Link>
                <div className='flex items-center gap-12 max-4xl:gap-6'>
                    <DesktopMenu
                        activeTheme={activeTheme}
                        setActiveTheme={setActiveTheme}
                    />
                    <FilledButton
                        text="Hire Me!"
                        containerClasses='px-8 py-4'
                        clickFunction={useOpenLink("https://www.linkedin.com/in/frederico-silva-727a8b21a/")}
                    />
                    <MobileMenu
                        activeTheme={activeTheme}
                        setActiveTheme={setActiveTheme}
                    />
                </div>
            </div>
        </header>
    )
}

const DesktopMenu = ({ activeTheme, setActiveTheme }: ThemeToggleProps) => {
    // Get current pathname
    const pathname = usePathname();

    // Function to determine which class to apply
    const getLinkClassName = (path: string) => {
        return pathname === path ? 'nav-selected-btn' : 'nav-hover-btn';
    };

    return (
        <nav className='flex gap-12 text-base max-4xl:gap-6 max-xl:hidden'>
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
                    <li className={`${activeTheme === 'light' ? 'bg-primary text-white' : 'hover:bg-secondary/50'} flex gap-2 py-2 pl-2 pr-12 rounded-xs cursor-pointer transition-[background] duration-300`} onClick={() => setActiveTheme('light')}>
                        <FaSun size={20} />
                        <p>Light</p>
                    </li>
                    <li className={`${activeTheme === 'dark' ? 'bg-primary text-white' : 'hover:bg-secondary/50'} flex gap-2 py-2 pl-2 pr-12 rounded-xs cursor-pointer transition-[background] duration-300`} onClick={() => setActiveTheme('dark')}>
                        <FaMoon size={20} />
                        <p>Dark</p>
                    </li>
                    <li className={`${activeTheme === 'system' ? 'bg-primary text-white' : 'hover:bg-secondary/50'} flex gap-2 py-2 pl-2 pr-12 rounded-xs cursor-pointer transition-[background] duration-300`} onClick={() => setActiveTheme('system')}>
                        <CgDarkMode size={20} />
                        <p>System</p>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

const MobileMenu = ({ activeTheme, setActiveTheme }: ThemeToggleProps) => {
    // State to track whether the drawer is open or closed
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // State to track the position and width of the slider
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
    // Track if we've done the first position calculation
    const [hasInitializedSlider, setHasInitializedSlider] = useState(false);

    // Refs for each theme button
    const lightBtnRef = useRef<HTMLButtonElement>(null);
    const darkBtnRef = useRef<HTMLButtonElement>(null);
    const systemBtnRef = useRef<HTMLButtonElement>(null);

    // Update slider position when theme changes or drawer opens
    useEffect(() => {
        if (!isDrawerOpen) return;

        // Use a slight delay to ensure the drawer is fully rendered
        const timer = setTimeout(() => {
            let targetRef;

            switch (activeTheme) {
                case 'light':
                    targetRef = lightBtnRef.current;
                    break;
                case 'dark':
                    targetRef = darkBtnRef.current;
                    break;
                case 'system':
                    targetRef = systemBtnRef.current;
                    break;
                default:
                    targetRef = systemBtnRef.current;
            }

            if (targetRef) {
                setSliderStyle({
                    left: targetRef.offsetLeft,
                    width: targetRef.offsetWidth,
                });
                setHasInitializedSlider(true);
            }
        }, 100); // Small delay for DOM to be ready

        return () => clearTimeout(timer);
    }, [activeTheme, isDrawerOpen]);

    // Handle window resize
    useEffect(() => {
        if (!isDrawerOpen) return;

        const handleResize = () => {
            // Re-trigger position calculation on resize
            let targetRef;

            switch (activeTheme) {
                case 'light':
                    targetRef = lightBtnRef.current;
                    break;
                case 'dark':
                    targetRef = darkBtnRef.current;
                    break;
                case 'system':
                    targetRef = systemBtnRef.current;
                    break;
                default:
                    targetRef = systemBtnRef.current;
            }

            if (targetRef) {
                setSliderStyle({
                    left: targetRef.offsetLeft,
                    width: targetRef.offsetWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeTheme, isDrawerOpen]);

    return (
        <Drawer onOpenChange={(open) => setIsDrawerOpen(open)} open={isDrawerOpen}>
            <DrawerTrigger className="items-center justify-center">
                <CgMenuRight size={56} className='hidden max-xl:flex cursor-pointer text-black dark:text-white' />
            </DrawerTrigger>
            <DrawerContent className='bg-light-mode-200 dark:bg-dark-mode-200 font-bold text-black dark:text-white !rounded-t-3xl shadow-[inset_0_4px_10px_-1px_rgba(10,18,100,0.5)]'>
                <VisuallyHidden.Root>
                    <DrawerTitle>Mobile Navigation Menu</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </VisuallyHidden.Root>
                <div className='flex flex-col gap-6 mt-16'>
                    <Link href="/" className='w-full text-center' onClick={() => setIsDrawerOpen(false)}>Home</Link>
                    <Link href="/about" className='w-full text-center' onClick={() => setIsDrawerOpen(false)}>About</Link>
                    <Link href="/projects" className='w-full text-center' onClick={() => setIsDrawerOpen(false)}>Projects</Link>
                    <Link href="/contact" className='w-full text-center' onClick={() => setIsDrawerOpen(false)}>Contact</Link>
                    <div className='w-full text-center'>
                        <div className='relative flex justify-center bg-slate-300 dark:bg-dark-mode-100 py-2 px-2 rounded-full w-fit m-auto text-base font-normal my-8'>
                            {/* The sliding indicator - only show after the position is calculated */}
                            {hasInitializedSlider && (
                                <div
                                    className='absolute top-2 bottom-2 bg-primary rounded-full transition-all duration-300 ease-out'
                                    style={{
                                        left: `${sliderStyle.left}px`,
                                        width: `${sliderStyle.width}px`
                                    }}
                                />
                            )}
                            <button
                                ref={lightBtnRef}
                                onClick={() => setActiveTheme('light')}
                                className={`${activeTheme === 'light' ? 'text-white' : ''} flex items-center gap-2 py-2 px-8 rounded-full cursor-pointer z-10 relative max-lg:px-3`}
                            >
                                <FaSun size={24} />
                                <span>Light</span>
                            </button>
                            <button
                                ref={darkBtnRef}
                                onClick={() => setActiveTheme('dark')}
                                className={`${activeTheme === 'dark' ? 'text-white' : ''} flex items-center gap-2 py-2 px-8 rounded-full cursor-pointer z-10 relative max-lg:px-3`}
                            >
                                <FaMoon size={24} />
                                <span>Dark</span>
                            </button>
                            <button
                                ref={systemBtnRef}
                                onClick={() => setActiveTheme('system')}
                                className={`${activeTheme === 'system' ? 'text-white' : ''} flex items-center gap-2 py-2 px-8 rounded-full cursor-pointer z-10 relative max-lg:px-3`}
                            >
                                <CgDarkMode size={24} />
                                <span>System</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default Navbar