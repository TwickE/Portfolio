import { useState, useEffect } from 'react';

const useHoverSupport = () => {
    const [isHoverSupported, setIsHoverSupported] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(hover: hover)');
        setIsHoverSupported(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsHoverSupported(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isHoverSupported;
};

export default useHoverSupport