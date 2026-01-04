"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
    const { content } = useLanguage();

    return (
        <footer className="bg-slate-100 dark:bg-slate-950 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

                <div className="flex items-center gap-6 mb-8">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:shadow-md text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-all transform hover:-translate-y-1"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/erturkemirhan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:shadow-md text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-all transform hover:-translate-y-1"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                        href="mailto:info@emirhanerturk.com"
                        className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:shadow-md text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all transform hover:-translate-y-1"
                    >
                        <Mail className="w-5 h-5" />
                    </a>
                </div>

                <div className="text-center text-slate-500 dark:text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Emirhan Ertürk. {content.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
}
