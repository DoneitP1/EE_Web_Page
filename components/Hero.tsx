"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useRef, useCallback, useEffect, useState } from "react";
import { AnimatedLines } from "@/components/AnimatedLines";
import { HeroFluidCyborg } from "@/components/HeroFluidCyborg";
import { HeroTopographicMesh } from "@/components/HeroTopographicMesh";

// Premium easing matching landonorris.com
const PREMIUM_EASE = [0.65, 0.05, 0, 1] as const;

// Inline Marquee with hover-pause like landonorris.com
const Marquee = ({ text, direction = 1, speed = 15, className = "" }: { text: string; direction?: number; speed?: number; className?: string }) => {
    const [paused, setPaused] = useState(false);

    return (
        <div
            className={`flex overflow-hidden whitespace-nowrap ${className}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <motion.div
                className="flex gap-8"
                animate={{ x: direction > 0 ? ["-50%", "0%"] : ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                }}
                style={{ animationPlayState: paused ? "paused" : "running" }}
            >
                {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="mx-4">{text}</span>
                ))}
            </motion.div>
        </div>
    );
};

// Staggered text reveal — clip-path animation like landonorris.com
const RevealText = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
    <motion.div
        initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 30, opacity: 0 }}
        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: PREMIUM_EASE, delay }}
        className={className}
    >
        {children}
    </motion.div>
);

export function Hero() {
    const { content } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Scroll progress for the entire 300vh section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // --- MOUSE PARALLAX SETUP (local, normalized -0.5 to 0.5) ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for parallax
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    // Parallax transforms — different resistance for different layers
    const imageX = useTransform(smoothMouseX, [-0.5, 0.5], ["-2%", "2%"]);
    const imageY = useTransform(smoothMouseY, [-0.5, 0.5], ["-2%", "2%"]);

    const marqueeX = useTransform(smoothMouseX, [-0.5, 0.5], ["2%", "-2%"]);
    const marqueeY = useTransform(smoothMouseY, [-0.5, 0.5], ["2%", "-2%"]);

    const widgetX = useTransform(smoothMouseX, [-0.5, 0.5], ["-5px", "5px"]);
    const widgetY = useTransform(smoothMouseY, [-0.5, 0.5], ["-5px", "5px"]);

    // --- SCROLL ANIMATION CONTROLS ---

    // 1. Background Color on sticky div (only 100vh, not full 300vh — much cheaper repaint)
    const backgroundColor = useTransform(scrollYProgress, [0.2, 0.6], ["#FFF8F0", "#0F172A"]);

    // Widget text/border colors invert with background
    const widgetTextColor = useTransform(
        scrollYProgress,
        [0.2, 0.4],
        ["#0F172A", "#FFF8F0"]
    );
    const widgetBorderColor = useTransform(
        scrollYProgress,
        [0.2, 0.4],
        ["rgba(15, 23, 42, 0.1)", "rgba(255, 248, 240, 0.1)"]
    );

    // 2. Marquee Opacity & Scale
    const marqueeOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 0.15]);
    const marqueeScale = useTransform(scrollYProgress, [0.1, 0.6], [1.2, 1]);

    // 3. Hero Image: Pins, scales down, fades out
    const imageScaleScroll = useTransform(scrollYProgress, [0, 0.1, 0.6], [1.1, 1, 0.6]);
    const imageOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);

    // 4. Text Reveal: Appears after image fades
    const textOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.6, 0.8], [100, 0]);
    const textPointerEvents = useTransform(scrollYProgress, (v) => v > 0.6 ? "auto" : "none");

    // 5. Topography Overlay Opacity
    const textureOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.05]);

    // 6. Animated Lines — visible earlier than topography
    const linesOpacity = useTransform(scrollYProgress, [0, 0.15], [0.6, 1]);

    // 7. Scroll hint fades out quickly
    const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Throttled mouse handler — skip heavy getBoundingClientRect calls
    const lastMouseUpdate = useRef(0);
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const now = performance.now();
        if (now - lastMouseUpdate.current < 32) return; // ~30fps throttle
        lastMouseUpdate.current = now;
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX / width) - 0.5);
        mouseY.set((clientY / height) - 0.5);
    }, [mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    return (
        <section
            ref={sectionRef}
            className="relative h-[300vh] w-full bg-[#FFF8F0]"
        >
            {/* Sticky Container — Pins the view while scrolling */}
            <motion.div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden"
                style={{ backgroundColor }}
                onMouseMove={isMobile ? undefined : handleMouseMove}
                onMouseLeave={isMobile ? undefined : handleMouseLeave}>

                {/* --- BACKGROUND LAYERS --- */}

                {/* 0. Topographic Mesh — fluid metaball contours */}
                <div className="absolute inset-0 z-[1] pointer-events-none">
                    <HeroTopographicMesh
                        containerRef={stickyRef}
                        scrollProgress={scrollYProgress}
                        className="absolute inset-0"
                    />
                </div>

                {/* 1. Animated Flowing Lines — visible from start */}
                <AnimatedLines
                    parallaxX={isMobile ? undefined : marqueeX}
                    parallaxY={isMobile ? undefined : marqueeY}
                    opacity={linesOpacity}
                />

                {/* 2. Topography Texture (SVG Pattern) — desktop only */}
                {!isMobile && (
                    <motion.div
                        style={{ opacity: textureOpacity, x: marqueeX, y: marqueeY }}
                        className="absolute inset-0 z-[1] pointer-events-none"
                    >
                        <svg className="w-full h-full opacity-50" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="topography" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M0 40c5.523 0 10-4.477 10-10V0h10v20c0 5.523 4.477 10 10 10s10-4.477 10-10V0h10v40H0z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#topography)" className="text-[var(--lagoon-mist)]" />
                        </svg>
                    </motion.div>
                )}

                {/* 3. Marquee Text Layer */}
                <motion.div
                    style={{ opacity: marqueeOpacity, scale: marqueeScale, x: isMobile ? undefined : marqueeX, y: isMobile ? undefined : marqueeY }}
                    className="absolute inset-0 z-[1] flex flex-col justify-center items-center pointer-events-none select-none overflow-hidden"
                >
                    <div className="pointer-events-auto">
                        <Marquee
                            text={content.hero.marquee.line1}
                            speed={30}
                            className="text-[15vh] md:text-[20vh] font-black text-white leading-none opacity-20 italic font-sans"
                        />
                    </div>
                    <div className="pointer-events-auto mt-[-2vh]">
                        <Marquee
                            text={content.hero.marquee.line2}
                            speed={25}
                            direction={-1}
                            className="text-[15vh] md:text-[20vh] font-black text-[var(--lagoon-mist)] leading-none opacity-20 italic font-sans"
                        />
                    </div>
                </motion.div>

                {/* --- FLOATING WIDGETS --- */}
                <motion.div
                    style={{ x: widgetX, y: widgetY, color: widgetTextColor, borderColor: widgetBorderColor, opacity: imageOpacity }}
                    className="absolute bottom-8 left-8 z-50 hidden md:flex items-center gap-3 px-4 py-2 border rounded-full backdrop-blur-sm"
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-widest uppercase">{content.hero.widgets.location}</span>
                </motion.div>

                {/* --- HERO IMAGE LAYER --- */}
                <motion.div
                    style={{
                        scale: imageScaleScroll,
                        opacity: imageOpacity,
                        x: isMobile ? undefined : imageX,
                        y: isMobile ? undefined : imageY,
                    }}
                    className="absolute inset-0 w-full h-full flex items-end justify-center z-10 origin-bottom will-change-[transform,opacity]"
                >
                    <div
                        ref={photoRef}
                        className="relative w-full max-w-[1400px] h-[85vh] md:h-[90vh] mt-auto"
                        style={{
                            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, transparent 100%)",
                        }}
                    >
                        <Image
                            src="/hero-new.png"
                            alt="Emirhan Erturk"
                            fill
                            className="object-contain object-bottom hero-image-glow"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                            quality={85}
                        />
                    </div>
                </motion.div>

                {/* --- VIGNETTE --- */}
                <motion.div
                    style={{ opacity: imageOpacity }}
                    className="absolute inset-0 pointer-events-none z-10"
                >
                    <div className="absolute inset-0"
                        style={{
                            background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)"
                        }}
                    />
                </motion.div>

                {/* --- FLUID CYBORG LAYER --- */}
                <motion.div
                    style={{
                        opacity: imageOpacity,
                        maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.2) 65%, transparent 85%)",
                        WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.2) 65%, transparent 85%)",
                    }}
                    className="absolute inset-0 z-[15] pointer-events-none will-change-[opacity]"
                >
                    <HeroFluidCyborg
                        cyborgSrc="/hero-photo-cyborg.png"
                        containerRef={stickyRef}
                        photoContainerRef={photoRef}
                        className="absolute inset-0"
                    />
                </motion.div>

                {/* --- TEXT CONTENT LAYER --- */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY, pointerEvents: textPointerEvents as any }}
                    className="absolute inset-0 z-20 flex flex-col justify-center items-center pb-24 md:pb-32 text-center"
                >
                    <div className="max-w-5xl mx-auto px-6 md:px-12 w-full">
                        <RevealText delay={0}>
                            <span className="block text-sm font-sans font-bold text-[var(--lagoon-mist)] tracking-[0.2em] uppercase mb-4">
                                {content.hero.greeting}
                            </span>
                        </RevealText>

                        <RevealText delay={0.1}>
                            <h1 className="text-[clamp(3.5rem,10vw,8.5rem)] font-bold text-white leading-[0.95] tracking-tight mb-6 drop-shadow-2xl">
                                {content.hero.title}
                            </h1>
                        </RevealText>

                        <RevealText delay={0.2}>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8 text-[var(--arctic-glow)]">
                                {content.hero.subtitle}
                            </h2>
                        </RevealText>

                        <RevealText delay={0.3}>
                            <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto mb-12 leading-relaxed">
                                {content.hero.description}
                            </p>
                        </RevealText>

                        <RevealText delay={0.4}>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#projects"
                                    className="px-8 py-4 bg-[var(--lagoon-mist)] text-[#1a3a38] font-bold rounded-none hover:bg-[#7ac4bb] inline-flex items-center justify-center gap-3 uppercase tracking-wider"
                                    style={{ transition: "background-color 0.75s cubic-bezier(0.65, 0.05, 0, 1)" }}
                                >
                                    {content.hero.ctaPrimary}
                                </motion.a>

                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#about"
                                    className="px-8 py-4 border border-slate-500 text-white font-bold rounded-none hover:bg-white/10 inline-flex items-center justify-center gap-3 uppercase tracking-wider"
                                    style={{ transition: "background-color 0.75s cubic-bezier(0.65, 0.05, 0, 1)" }}
                                >
                                    {content.hero.ctaSecondary}
                                </motion.a>
                            </div>
                        </RevealText>
                    </div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    style={{ opacity: scrollHintOpacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--storm-slate)]/40">
                        Scroll
                    </span>
                    <div className="w-px h-8 bg-[var(--storm-slate)]/30 relative overflow-hidden">
                        <motion.div
                            className="w-full bg-[var(--lagoon-mist)] absolute top-0"
                            style={{ height: "50%" }}
                            animate={{ y: ["0%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: PREMIUM_EASE }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
