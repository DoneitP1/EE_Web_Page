"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
    Terminal, FileCode, Database, Cpu, Atom, Layers, Palette,
    FileType, Server, Zap, BarChart, Calculator, GitBranch,
    Box, Code2, PenTool
} from "lucide-react";

export function Skills() {
    const { content } = useLanguage();

    const getIcon = (name: string) => {
        const iconMap: Record<string, any> = {
            "Python": FileCode,
            "JavaScript": FileCode,
            "TypeScript": FileCode,
            "SQL": Database,
            "C++": Cpu,
            "React": Atom,
            "Next.js": Layers,
            "Tailwind CSS": Palette,
            "HTML5": FileType,
            "CSS3": Palette,
            "Node.js": Server,
            "FastAPI": Zap,
            "PostgreSQL": Database,
            "Pandas": BarChart,
            "NumPy": Calculator,
            "Git": GitBranch,
            "Docker": Box,
            "VS Code": Code2,
            "Figma": PenTool
        };
        return iconMap[name] || Terminal;
    };

    return (
        <section id="skills" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        {content.skills.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        {content.hero.description}
                    </p>
                </motion.div>

                <div className="space-y-16">
                    {content.skills.categories.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                            <h3 className="text-xl font-medium text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
                                {category.name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {category.items.map((item, index) => {
                                    const Icon = getIcon(item.name);
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
