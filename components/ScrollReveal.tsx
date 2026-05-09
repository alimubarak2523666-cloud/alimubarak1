'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollReveal — wraps any content with a smooth fade-up animation
 * triggered when the element enters the viewport.
 *
 * Uses IntersectionObserver (zero dependencies, runs once per element).
 *
 * Props:
 *   delay    — optional delay in ms (default 0)
 *   className — extra classes on the wrapper div
 */
export default function ScrollReveal({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setTimeout(() => el.classList.add('sr-visible'), delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    );

    observer.observe(el);

    // Fallback: if already in viewport when JS runs, reveal after next paint
    const raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        reveal();
        observer.unobserve(el);
      }
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`sr-hidden ${className}`}>
      {children}
    </div>
  );
}
