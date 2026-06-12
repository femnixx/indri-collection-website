import { useEffect, useRef, useState } from 'react';

// Re-triggerable scroll animation hook
// Returns [ref, isVisible] — resets when element leaves viewport, re-animates on re-entry
export function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting), 
            { threshold }
        );
        
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, visible];
}
