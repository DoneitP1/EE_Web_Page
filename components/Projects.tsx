"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Globe, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function Projects() {
    const { content } = useLanguage();

    return (
        <section id="projects" className="py-32 bg-[var(--glacier-whisper)] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-[var(--lagoon-mist)]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-0 w-[500px] h-[500px] bg-[var(--lagoon-mist)]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-32 md:pl-12"
                >
                    <div className="line-accent mb-6" />
                    <span className="text-base font-sans font-semibold text-[var(--lagoon-mist)] tracking-widest uppercase mb-4 block">
                        {content.projects.title}
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold text-[var(--storm-slate)] tracking-tight">
                        Selected<br /><span className="text-[var(--storm-slate)]/30">Works</span>
                    </h2>
                </motion.div>

                {/* Alternating project blocks */}
                <div className="space-y-40">
                    {content.projects.items.map((project, index) => (
                        <ProjectItem key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProjectItem({ project, index }: { project: any, index: number }) {
    const isEven = index % 2 === 0;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
        >
            {/* Image Side */}
            <div className="w-full lg:w-3/5 group">
                <Link href={`/projects/${project.slug}`} className="block relative">
                    <div className="relative aspect-[16/9] overflow-hidden bg-white/60 rounded-sm shadow-md glow-hover">
                        {/* Image Reveal Mask */}
                        <motion.div
                            initial={{ scale: 1.1 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {project.image ? (
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 45vw"
                                    loading="lazy"
                                    quality={80}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-8xl font-black text-[var(--storm-slate)]/5">
                                        {project.title.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[var(--arctic-glow)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Custom Cursor/Button for Hover */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                            <span className="w-24 h-24 rounded-full bg-[var(--arctic-glow)] flex items-center justify-center shadow-lg">
                                <ArrowUpRight className="w-8 h-8 text-white" />
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-sm font-mono text-[var(--lagoon-mist)] tracking-widest">
                        0{index + 1}
                    </span>
                    <div className="h-px bg-[var(--lagoon-mist)]/30 w-12" />
                </div>

                <Link
                    href={`/projects/${project.slug}`}
                    className="block group/title"
                >
                    <h3 className="text-3xl md:text-5xl font-bold text-[var(--storm-slate)] mb-6 group-hover/title:text-[var(--lagoon-mist)] transition-colors duration-300">
                        {project.title}
                    </h3>
                </Link>

                <p className="text-base md:text-lg text-[var(--storm-slate)]/70 leading-relaxed mb-8">
                    {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {project.tech.map((tech: string) => (
                        <span
                            key={tech}
                            className="px-3 py-1 bg-white/50 border border-[var(--storm-slate)]/15 text-xs text-[var(--storm-slate)] font-mono uppercase tracking-wider rounded-sm"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-6">
                    <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--storm-slate)] hover:text-[var(--lagoon-mist)] transition-colors group/link"
                    >
                        View Project
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                    </Link>

                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--storm-slate)]/40 hover:text-[var(--storm-slate)] transition-colors"
                        >
                            {project.link.includes("github.com") ? (
                                <><Github className="w-4 h-4" />Source</>
                            ) : (
                                <><Globe className="w-4 h-4" />Website</>
                            )}
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
