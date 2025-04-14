import { useEffect, useState, useCallback, RefObject } from 'react';

const useScrollAnimation = (ref: RefObject<HTMLElement | null>, pixelOffset = 100) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    const checkVisibility = useCallback(() => {
        if (!ref.current || hasAnimated) return;

        const elementTop = ref.current.getBoundingClientRect().top;
        const elementHeight = ref.current.getBoundingClientRect().height;
        
        if (elementTop < window.innerHeight - pixelOffset && elementTop > -elementHeight) {
            setIsVisible(true);
            setHasAnimated(true);
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
        }
    }, [ref, pixelOffset, hasAnimated]);

    useEffect(() => {
        checkVisibility();
        
        if (!hasAnimated) {
            window.addEventListener('scroll', checkVisibility);
            window.addEventListener('resize', checkVisibility);
        }

        return () => {
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
        };
    }, [checkVisibility, hasAnimated]);

    return isVisible;
};

export default useScrollAnimation;