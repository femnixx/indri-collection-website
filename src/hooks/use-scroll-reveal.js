"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal
 * Returns [ref, isVisible].
 *
 * Performance notes:
 * - Uses a lower threshold on mobile (< 768px) so elements reveal
 *   before they need to be fully on-screen — prevents the "pop in"
 *   lag that happens when iOS waits for 15% of a tall element.
 * - Sets will-change: transform on the element just before it becomes
 *   visible, then removes it 800ms after — prevents the browser from
 *   keeping GPU layers alive for the entire page lifetime.
 */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Lower threshold on narrow screens so reveals happen earlier,
    // reducing the chance a slow-compositing mobile GPU misses the window.
    const isMobile = window.innerWidth < 768;
    const t = isMobile ? Math.min(threshold, 0.08) : threshold;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Release GPU layer after animation finishes
          setTimeout(() => {
            if (el) el.style.willChange = 'auto';
          }, 900);
        } else {
          setVisible(false);
          // Re-prime GPU layer for next entry
          el.style.willChange = 'opacity, transform';
        }
      },
      { threshold: t }
    );

    // Prime before first observation
    el.style.willChange = 'opacity, transform';
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}