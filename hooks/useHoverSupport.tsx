import { useState, useEffect } from 'react';

const useHoverSupport = () => {
    const [isHoverSupported, setIsHoverSupported] = useState(false);

    useEffect(() => {
        // Check for hover support
        const hoverMediaQuery = window.matchMedia('(hover: hover)');

        // Check for touch capability
        const touchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        // Check for small pointer (mouse/trackpad vs finger)
        const finePointerQuery = window.matchMedia('(pointer: fine)');

        // Only consider hover supported when:
        // 1. The device reports hover support
        // 2. AND EITHER it's not a touch device OR it has a fine pointer like a mouse
        const realHoverSupport = hoverMediaQuery.matches && (!touchDevice || finePointerQuery.matches);

        setIsHoverSupported(realHoverSupport);

        // Listen for changes in hover capability
        const handleChange = () => {
            const updatedHoverSupport = hoverMediaQuery.matches &&
                (!touchDevice || finePointerQuery.matches);
            setIsHoverSupported(updatedHoverSupport);
        };

        hoverMediaQuery.addEventListener('change', handleChange);
        finePointerQuery.addEventListener('change', handleChange);

        return () => {
            hoverMediaQuery.removeEventListener('change', handleChange);
            finePointerQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isHoverSupported;
};

export default useHoverSupport;