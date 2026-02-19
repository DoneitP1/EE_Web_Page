"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

export function Footer() {
    const { content } = useLanguage();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="py-16 bg-[var(--glacier-whisper)] border-t border-[var(--storm-slate)]/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left: Brand */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <span className="font-sans text-2xl font-bold text-[var(--storm-slate)]">
                            emirhanerturk<span className="text-[var(--lagoon-mist)]">.</span>com
                        </span>
                        <p className="text-xs text-[var(--storm-slate)]/60 font-sans">
                            &copy; {new Date().getFullYear()} Emirhan Ert&uuml;rk. {content.footer.rights}
                        </p>
                    </div>

                    {/* Center: Social Links */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/DoneitP1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 border border-[var(--storm-slate)]/10 text-[var(--storm-slate)]/60 hover:text-[var(--lagoon-mist)] hover:border-[var(--lagoon-mist)] transition-all bg-[var(--arctic-glow)] shadow-sm"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/erturkemirhan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 border border-[var(--storm-slate)]/10 text-[var(--storm-slate)]/60 hover:text-[var(--lagoon-mist)] hover:border-[var(--lagoon-mist)] transition-all bg-[var(--arctic-glow)] shadow-sm"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="mailto:info@emirhanerturk.com"
                            className="p-3 border border-[var(--storm-slate)]/10 text-[var(--storm-slate)]/60 hover:text-[var(--lagoon-mist)] hover:border-[var(--lagoon-mist)] transition-all bg-[var(--arctic-glow)] shadow-sm"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Right: Back to top */}
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-xs font-sans font-semibold text-[var(--storm-slate)]/60 hover:text-[var(--lagoon-mist)] transition-colors uppercase tracking-wider"
                    >
                        Back to top
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
