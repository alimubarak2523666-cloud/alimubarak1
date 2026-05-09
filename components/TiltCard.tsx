'use client';
import { useRef } from 'react';

// TiltCard — Apple-style 3D perspective tilt on mouse move.
// Wraps any card element. Add class names for border/bg/padding on this wrapper;
// put the inner content (Link, div) as children.
// A subtle gold-shimmer overlay follows the cursor.

export default function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-5px) scale(1.02)`;
    const shine = el.querySelector<HTMLElement>('.tc-shine');
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(161,123,58,0.10), transparent 70%)`;
      shine.style.opacity = '1';
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    const shine = el.querySelector<HTMLElement>('.tc-shine');
    if (shine) shine.style.opacity = '0';
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1)',
        position: 'relative',
        willChange: 'transform',
      }}
    >
      {/* Cursor-tracking gold shimmer */}
      <div
        className="tc-shine"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
          zIndex: 2,
        }}
      />
      {children}
    </div>
  );
}
