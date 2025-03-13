"use client";

import useTheme from "@/hooks/useTheme"

const SkillsSection = () => {
    const { activeTheme, currentTheme, isDarkMode } = useTheme();

    return (
        <section className='text-black dark:text-white text-3xl p-8'>
            <h3>Selected Theme: {activeTheme}</h3>
            <p>Current Theme: {currentTheme}</p>
            <p>Dark Mode: {isDarkMode ? 'On' : 'Off'}</p>
        </section>
    )
}

export default SkillsSection