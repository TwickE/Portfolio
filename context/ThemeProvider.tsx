"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeContextType = {
    activeTheme: Theme;
    setActiveTheme: Dispatch<SetStateAction<Theme>>;
    currentTheme: 'light' | 'dark';
    isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Use state with a default value instead of trying to access localStorage during SSR
    const [activeTheme, setActiveTheme] = useState<Theme>('system');
    const [systemIsDark, setSystemIsDark] = useState<boolean>(false);
    const [isClient, setIsClient] = useState(false);

    // This effect runs only on the client after hydration
    useEffect(() => {
        setIsClient(true);

        // Now that we're on the client, we can safely access localStorage
        const storedTheme = localStorage.getItem('activeTheme') as Theme | null;
        if (storedTheme) {
            setActiveTheme(storedTheme);
        }

        // Check system preference
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setSystemIsDark(isDarkMode);

        // Apply theme based on preference
        const effectiveTheme = storedTheme || 'system';
        const isDark = effectiveTheme === 'dark' ||
            (effectiveTheme === 'system' && isDarkMode);

        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    // This effect runs when theme changes after initial hydration
    useEffect(() => {
        if (!isClient) return;

        // Save active theme to local storage
        if (activeTheme === 'system') {
            localStorage.removeItem('activeTheme');
        } else {
            localStorage.setItem('activeTheme', activeTheme);
        }

        // Apply theme to document
        const isDark =
            activeTheme === 'dark' ||
            (activeTheme === 'system' && systemIsDark);

        document.documentElement.classList.toggle('dark', isDark);

        // Listen for system theme changes if using system preference
        if (activeTheme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleSystemThemeChange = (e: MediaQueryListEvent) => {
                setSystemIsDark(e.matches);
                document.documentElement.classList.toggle('dark', e.matches);
            };

            mediaQuery.addEventListener('change', handleSystemThemeChange);
            return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
        }
    }, [activeTheme, systemIsDark, isClient]);

    // Get the actual current theme (resolving system preference)
    const currentTheme = activeTheme === 'system'
        ? (systemIsDark ? 'dark' : 'light')
        : activeTheme;

    return (
        <ThemeContext.Provider
            value={{
                activeTheme,
                setActiveTheme,
                currentTheme,
                isDarkMode: currentTheme === 'dark',
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}