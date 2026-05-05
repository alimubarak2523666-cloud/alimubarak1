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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            el.classList.add('sr-visible');
          }, delay);
          observer.unobserve(el);
          // cleanup timer if component unmounts before it fires
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.06, rootMargin: '-48px 0px 0px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`sr-hidden ${className}`}>
      {children}
    </div>
  );
}
