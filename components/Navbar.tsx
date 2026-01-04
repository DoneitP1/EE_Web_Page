"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Globe, Menu, X, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { language, toggleLanguage, content } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { name: content.nav.about, href: "#about" },
        { name: content.nav.projects, href: "#projects" },
        { name: content.nav.skills, href: "#skills" },
    ];

    if (!mounted) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <div className="relative w-10 h-10 md:w-12 md:h-12">
                            <Image
                                src="/logo.png"
                                alt="EE Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-800 pl-4">
                            <a
                                href="/cv.png"
                                download="Emirhan_Erturk_CV.png"
                                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                {content.nav.downloadCv}
                            </a>

                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1"
                                aria-label="Toggle Language"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-xs font-bold">{language.toUpperCase()}</span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <Moon className="w-5 h-5 text-indigo-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1"
                        >
                            <span className="text-xs font-bold">{language.toUpperCase()}</span>
                        </button>

                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
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

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="/cv.png"
                            download="Emirhan_Erturk_CV.png"
                            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-blue-600 dark:text-cyan-400"
                        >
                            <Download className="w-5 h-5" />
                            {content.nav.downloadCv}
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
