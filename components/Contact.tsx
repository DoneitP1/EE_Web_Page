"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Send, ArrowUpRight } from "lucide-react";

export const Contact = () => {
    const { content } = useLanguage();
    const { contactSection } = content;
    const [formState, setFormState] = useState<{
        status: 'idle' | 'submitting' | 'success' | 'error';
        message: string;
    }>({ status: 'idle', message: '' });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState({ status: 'submitting', message: '' });

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://formspree.io/f/xgovddpz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setFormState({ status: 'success', message: 'Message sent successfully!' });
                (e.target as HTMLFormElement).reset();
            } else {
                setFormState({ status: 'error', message: 'Failed to send message. Please try again.' });
            }
        } catch {
            setFormState({ status: 'error', message: 'An error occurred. Please try again.' });
        }
    };

    return (
        <section id="contact" className="py-32 bg-[var(--glacier-whisper)] relative overflow-hidden">
            {/* Decorative background text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                <span className="text-[12rem] md:text-[20rem] font-bold text-[var(--storm-slate)]/[0.03] leading-none whitespace-nowrap">
                    CONTACT
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
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
                        {contactSection.title}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--storm-slate)] tracking-tight mb-4">
                        {contactSection.title}
                    </h2>
                    <p className="text-base text-[var(--storm-slate)]/70 max-w-xl leading-relaxed">
                        {contactSection.subtitle}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-5 gap-12"
                >
                    {/* Contact Info - Left side */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Email Card */}
                        <a
                            href={`mailto:${contactSection.contactInfo.email}`}
                            className="group glow-hover flex items-center gap-4 p-5 bg-[var(--arctic-glow)] border border-[var(--storm-slate)]/10 hover:border-[var(--lagoon-mist)]/30 transition-all shadow-sm"
                        >
                            <div className="p-2.5 bg-[var(--lagoon-mist)]/10">
                                <Mail className="w-5 h-5 text-[var(--lagoon-mist)]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-[var(--storm-slate)]/60 mb-0.5">
                                    {contactSection.contactInfo.emailLabel}
                                </p>
                                <p className="text-sm font-medium text-[var(--storm-slate)] truncate group-hover:text-[var(--lagoon-mist)] transition-colors">
                                    {contactSection.contactInfo.email}
                                </p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[var(--storm-slate)]/50 group-hover:text-[var(--lagoon-mist)] transition-colors" />
                        </a>

                        {/* Location Card */}
                        <div className="flex items-center gap-4 p-5 bg-[var(--arctic-glow)] border border-[var(--storm-slate)]/10 shadow-sm">
                            <div className="p-2.5 bg-[var(--lagoon-mist)]/10">
                                <MapPin className="w-5 h-5 text-[var(--lagoon-mist)]" />
                            </div>
                            <div>
                                <p className="text-xs text-[var(--storm-slate)]/60 mb-0.5">
                                    {contactSection.contactInfo.locationLabel}
                                </p>
                                <p className="text-sm font-medium text-[var(--storm-slate)]">
                                    {contactSection.contactInfo.location}
                                </p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 pt-2">
                            <a
                                href="https://github.com/DoneitP1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 border border-[var(--storm-slate)]/10 text-[var(--storm-slate)]/60 hover:text-[var(--lagoon-mist)] hover:border-[var(--lagoon-mist)] transition-all hover:-translate-y-0.5 bg-[var(--arctic-glow)] shadow-sm"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/erturkemirhan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 border border-[var(--storm-slate)]/10 text-[var(--storm-slate)]/60 hover:text-[var(--lagoon-mist)] hover:border-[var(--lagoon-mist)] transition-all hover:-translate-y-0.5 bg-[var(--arctic-glow)] shadow-sm"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Form - Right side */}
                    <div className="lg:col-span-3">
                        <div className="p-6 md:p-8 bg-[var(--arctic-glow)] border border-[var(--storm-slate)]/10 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--storm-slate)] mb-8">
                                {contactSection.form.title}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-sans font-semibold text-[var(--storm-slate)]/70 uppercase tracking-wider mb-2">
                                            {contactSection.form.nameLabel}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="editorial-input w-full bg-[var(--glacier-whisper)] border border-[var(--storm-slate)]/20 p-3 text-[var(--storm-slate)] focus:outline-none focus:border-[var(--lagoon-mist)] transition-colors"
                                            placeholder={contactSection.form.placeholders.name}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-sans font-semibold text-[var(--storm-slate)]/70 uppercase tracking-wider mb-2">
                                            {contactSection.form.emailLabel}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="editorial-input w-full bg-[var(--glacier-whisper)] border border-[var(--storm-slate)]/20 p-3 text-[var(--storm-slate)] focus:outline-none focus:border-[var(--lagoon-mist)] transition-colors"
                                            placeholder={contactSection.form.placeholders.email}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-sans font-semibold text-[var(--storm-slate)]/70 uppercase tracking-wider mb-2">
                                        {contactSection.form.messageLabel}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        className="editorial-input w-full bg-[var(--glacier-whisper)] border border-[var(--storm-slate)]/20 p-3 text-[var(--storm-slate)] focus:outline-none focus:border-[var(--lagoon-mist)] transition-colors resize-none"
                                        placeholder={contactSection.form.placeholders.message}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={formState.status === 'submitting'}
                                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formState.status === 'submitting' ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            {contactSection.form.buttonText}
                                        </>
                                    )}
                                </button>

                                {formState.status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-[var(--lagoon-mist)]/10 text-[var(--lagoon-mist)] text-center text-sm font-medium border border-[var(--lagoon-mist)]/20"
                                    >
                                        {formState.message}
                                    </motion.div>
                                )}

                                {formState.status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/10 text-red-500 text-center text-sm font-medium border border-red-500/20"
                                    >
                                        {formState.message}
                                    </motion.div>
                                )}
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
