"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export function About() {
    const { content } = useLanguage();

    return (
        <section id="about" className="py-32 bg-[var(--glacier-whisper)] relative">
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
                    <span className="text-base font-sans font-semibold text-[var(--lagoon-mist)] tracking-widest uppercase mb-4 block">
                        {content.about.title}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--storm-slate)] tracking-tight">
                        {content.about.title}
                    </h2>
                </motion.div>

                {/* Asymmetric layout */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-0"
                    >
                        {content.about.description.map((paragraph, index) => (
                            <div key={index}>
                                {index > 0 && (
                                    <div className="w-full h-px bg-[var(--storm-slate)]/10 my-10" />
                                )}
                                <div className="flex gap-6 items-start">
                                    <span className="text-base font-mono text-[var(--lagoon-mist)] tracking-wider mt-1.5 flex-shrink-0">
                                        0{index + 1}
                                    </span>
                                    <p className="text-lg md:text-xl text-[var(--storm-slate)]/80 leading-relaxed">
                                        {paragraph}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
