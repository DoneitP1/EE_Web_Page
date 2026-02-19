"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export function Skills() {
    const { content } = useLanguage();

    return (
        <section id="skills" className="py-32 bg-[var(--glacier-whisper)] relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-20"
                >
                    <div className="line-accent mb-6" />
                    <span className="text-base font-sans font-extrabold text-[var(--lagoon-mist)] tracking-widest uppercase mb-4 block">
                        {content.skills.title}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--storm-slate)] tracking-tight">
                        {content.skills.title}
                    </h2>
                </motion.div>

                {/* Category grid - one whileInView per category, pills are plain */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {content.skills.categories.map((category, categoryIndex) => (
                        <motion.div
                            key={categoryIndex}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                        >
                            <h3 className="text-base font-sans font-extrabold text-[var(--lagoon-mist)] tracking-widest uppercase mb-6 pb-3 border-b-2 border-[var(--lagoon-mist)]/40">
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {category.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="px-5 py-2.5 rounded-full border border-[var(--storm-slate)]/10 text-[var(--storm-slate)] hover:border-[var(--lagoon-mist)] hover:text-[var(--lagoon-mist)] hover:bg-[var(--arctic-glow)] transition-all duration-300 cursor-default bg-white/50"
                                    >
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
