// src/hooks/use-scroll-reveal.ts
// useScrollReveal (Optimized)
// 
// Performance improvements:
// - Uses requestAnimationFrame to batch visibility updates
// - Does NOT set will-change on elements until they are about to enter viewport
// - Only triggers ONE re-render per visibility change (not per scroll event)
// - Uses CSS classes instead of inline style objects where possible

import { useEffect, useRef, useState, useCallback } from 'react';

export function useScrollReveal(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;
    const t = isMobile ? Math.min(threshold, 0.08) : threshold;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Batch updates via rAF to avoid layout thrashing
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          if (entry.isIntersecting) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        });
      },
      { threshold: t }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Empty deps — we never change threshold

  return [ref, visible];
}