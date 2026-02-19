"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Globe, Menu, X, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { language, toggleLanguage, content } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: content.nav.about, href: "#about" },
        { name: content.nav.projects, href: "#projects" },
        { name: content.nav.skills, href: "#skills" },
        { name: content.nav.contact, href: "#contact" },
    ];

    if (!mounted) {
        return null;
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-[rgba(255,248,240,0.9)] backdrop-blur-xl border-b border-[rgba(93,115,126,0.1)] py-4"
                    : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="flex-shrink-0 flex items-center gap-2 group">
                        <span className="font-sans text-xl font-bold text-[var(--storm-slate)] tracking-tight">
                            Emirhan Ertürk
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative text-base font-medium text-[var(--storm-slate)]/70 hover:text-[var(--storm-slate)] transition-colors duration-200 group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--lagoon-mist)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                            </a>
                        ))}
                    </div>

                    {/* Right side controls */}
                    <div className="hidden md:flex items-center gap-6">
                        <a
                            href="/cv.png"
                            download="Emirhan_Erturk_CV.png"
                            className="btn-primary flex items-center gap-2 py-2 px-6 text-sm"
                        >
                            <Download className="w-4 h-4" />
                            {content.nav.downloadCv}
                        </a>

                        <div className="w-px h-6 bg-[var(--storm-slate)]/20" />

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 text-[var(--storm-slate)]/70 hover:text-[var(--lagoon-mist)] transition-colors text-sm font-medium uppercase"
                            aria-label="Toggle Language"
                        >
                            <Globe className="w-4 h-4" />
                            {language.toUpperCase()}
                        </button>

                        {/* Theme Toggle - Hidden/Disabled if we force light mode, but keeping structure for now */}
                        {/* 
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-neutral-400 hover:text-[#c8ff00] transition-colors"
                        >... </button> 
                        */}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="text-[var(--storm-slate)] font-medium"
                        >
                            {language.toUpperCase()}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-[var(--storm-slate)] hover:text-[var(--lagoon-mist)] transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Full screen overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 top-[70px] bg-[var(--glacier-whisper)] z-40"
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-8 pb-20">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3, delay: i * 0.08 }}
                                    className="text-2xl font-bold text-[var(--storm-slate)] hover:text-[var(--lagoon-mist)] transition-colors"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                            <motion.a
                                href="/cv.png"
                                download="Emirhan_Erturk_CV.png"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3, delay: navLinks.length * 0.08 }}
                                className="btn-primary mt-6"
                            >
                                {content.nav.downloadCv}
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
