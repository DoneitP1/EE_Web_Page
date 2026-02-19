"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const lenis = new Lenis({
            duration: isMobile ? 0.8 : 1.0,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            autoRaf: true,
            touchMultiplier: isMobile ? 1.5 : 2,
        });

        lenisRef.current = lenis;

        // Handle hash navigation for smooth scroll to sections
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (anchor?.hash && anchor.origin === window.location.origin) {
                const el = document.querySelector(anchor.hash);
                if (el) {
                    e.preventDefault();
                    lenis.scrollTo(el as HTMLElement, { offset: -80 });
                }
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
