"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Github, ExternalLink, Code2, Database, Layout } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProjectDetail() {
    const { content } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const project = content.projects.items.find(p => p.slug === slug);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Project Not Found</h1>
                    <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation */}
                <Link
                    href="/#projects"
                    className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        {project.title}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        {project.tech.map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-none"
                            >
                                <Github className="w-5 h-5" />
                                View Source Code
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Main Image */}
                {project.details.images[0] && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 mb-16 border border-slate-200 dark:border-slate-800"
                    >
                        <div className="relative aspect-video">
                            <Image
                                src={project.details.images[0]}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </motion.div>
                )}

                {/* Case Study Content */}
                <div className="grid gap-12 md:gap-16">
                    {/* Problem & Solution */}
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <div className="w-6 h-6 text-red-600 dark:text-red-400 font-bold flex items-center justify-center">?</div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">The Problem</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {project.details.problem}
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <div className="w-6 h-6 text-green-600 dark:text-green-400 font-bold flex items-center justify-center">✓</div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">The Solution</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
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
                        className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data & Architecture</h2>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {project.details.architecture}
                        </p>
                    </motion.section>
                </div>
            </div>
        </article>
    );
}
