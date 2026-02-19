"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Github, Globe, Database, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProjectDetail() {
    const { content } = useLanguage();
    const params = useParams();
    const slug = params.slug as string;
    const galleryWrapRef = useRef<HTMLDivElement>(null);

    const project = content.projects.items.find(p => p.slug === slug);

    // Scroll-driven horizontal gallery
    const { scrollYProgress: galleryProgress } = useScroll({
        target: galleryWrapRef,
        offset: ["start start", "end end"],
    });

    const imageCount = project?.details.images.length || 1;
    // Translate the track so all images scroll through
    const trackX = useTransform(galleryProgress, [0, 1], ["0%", `-${((imageCount - 1) / imageCount) * 100}%`]);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--glacier-whisper)]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--storm-slate)] mb-4">Project Not Found</h1>
                    <Link href="/" className="text-[var(--arctic-glow)] hover:underline font-medium text-sm">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-[var(--glacier-whisper)] pt-24 pb-20 relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Navigation */}
                <Link
                    href="/#projects"
                    className="inline-flex items-center gap-2 text-sm text-[var(--storm-slate)]/60 hover:text-[var(--arctic-glow)] transition-colors mb-10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="line-accent mb-6" />
                    <span className="text-xs font-mono font-medium text-[var(--arctic-glow)] tracking-[0.3em] uppercase mb-4 block">
                        // Project
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--storm-slate)] mb-6 tracking-tight">
                        {project.title}
                    </h1>
                    <p className="text-lg text-[var(--storm-slate)]/70 leading-relaxed mb-8 max-w-3xl">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 border border-[var(--storm-slate)]/15 bg-white/50 text-[var(--storm-slate)] text-xs font-mono uppercase tracking-wider rounded-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider"
                        >
                            {project.link.includes("github.com") ? (
                                <>
                                    <Github className="w-4 h-4" />
                                    View Source Code
                                </>
                            ) : (
                                <>
                                    <Globe className="w-4 h-4" />
                                    Visit Website
                                </>
                            )}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    )}
                </motion.div>

            {/* Sticky Horizontal Scroll Gallery */}
            </div>
            {project.details.images.length > 0 && (
                <div
                    ref={galleryWrapRef}
                    className="relative mb-16"
                    style={{ height: `${imageCount * 80}vh` }}
                >
                    <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                        <motion.div
                            style={{ x: trackX }}
                            className="flex gap-6 px-8 md:px-16"
                        >
                            {project.details.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="shrink-0 w-[85vw] md:w-[70vw] lg:w-[60vw] overflow-hidden rounded-lg border border-[var(--storm-slate)]/10 bg-white/60 shadow-lg"
                                >
                                    <div className="relative aspect-video">
                                        <Image
                                            src={image}
                                            alt={`${project.title} screenshot ${index + 1}`}
                                            fill
                                            className="object-contain"
                                            loading={index < 2 ? "eager" : "lazy"}
                                            sizes="(max-width: 768px) 85vw, (max-width: 1024px) 70vw, 60vw"
                                            quality={75}
                                        />
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <span className="text-xs font-mono text-[var(--storm-slate)]/50 uppercase tracking-wider">
                                            {String(index + 1).padStart(2, "0")} / {String(project.details.images.length).padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            )}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Case Study Content */}
                <div className="grid gap-4 md:grid-cols-2 mb-8">
                    {/* Problem */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="glow-hover p-6 md:p-8 bg-white/60 border border-[var(--storm-slate)]/10 rounded-sm"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[var(--arctic-glow)]/10 rounded-sm">
                                <span className="text-[var(--arctic-glow)] font-bold text-sm">?</span>
                            </div>
                            <h2 className="text-lg font-bold text-[var(--storm-slate)]">The Problem</h2>
                        </div>
                        <p className="text-sm text-[var(--storm-slate)]/70 leading-relaxed">
                            {project.details.problem}
                        </p>
                    </motion.section>

                    {/* Solution */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="glow-hover p-6 md:p-8 bg-white/60 border border-[var(--storm-slate)]/10 rounded-sm"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-sm">
                                <span className="text-emerald-600 font-bold text-sm">&#10003;</span>
                            </div>
                            <h2 className="text-lg font-bold text-[var(--storm-slate)]">The Solution</h2>
                        </div>
                        <p className="text-sm text-[var(--storm-slate)]/70 leading-relaxed">
                            {project.details.solution}
                        </p>
                    </motion.section>
                </div>

                {/* Architecture */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glow-hover p-6 md:p-8 bg-white/60 border border-[var(--storm-slate)]/10 rounded-sm"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[var(--lagoon-mist)]/20 rounded-sm">
                            <Database className="w-4 h-4 text-[var(--lagoon-mist)]" />
                        </div>
                        <h2 className="text-lg font-bold text-[var(--storm-slate)]">Data & Architecture</h2>
                    </div>
                    <p className="text-sm text-[var(--storm-slate)]/70 leading-relaxed">
                        {project.details.architecture}
                    </p>
                </motion.section>
            </div>
        </article>
    );
}
