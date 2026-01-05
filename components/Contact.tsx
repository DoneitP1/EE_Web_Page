"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Send } from "lucide-react";

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
        } catch (error) {
            setFormState({ status: 'error', message: 'An error occurred. Please try again.' });
        }
    };

    return (
        <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        {contactSection.title}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded-full mb-8" />
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {contactSection.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                            {contactSection.contactInfo.title}
                        </h3>

                        <div className="space-y-8">
                            {/* Email */}
                            <div className="group flex items-start p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-6 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        {contactSection.contactInfo.emailLabel}
                                    </h4>
                                    <a href={`mailto:${contactSection.contactInfo.email}`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {contactSection.contactInfo.email}
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="group flex items-start p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl mr-6 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        {contactSection.contactInfo.locationLabel}
                                    </h4>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {contactSection.contactInfo.location}
                                    </p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-4 pt-4">
                                <a
                                    href="https://github.com/DoneitP1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300 hover:scale-110"
                                >
                                    <Github className="w-6 h-6" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/erturkemirhan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] dark:hover:text-white transition-all duration-300 hover:scale-110"
                                >
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                            {contactSection.form.title}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {contactSection.form.nameLabel}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder={contactSection.form.placeholders.name}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {contactSection.form.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder={contactSection.form.placeholders.email}
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {contactSection.form.messageLabel}
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                    placeholder={contactSection.form.placeholders.message}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formState.status === 'submitting'}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formState.status === 'submitting' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        {contactSection.form.buttonText}
                                    </>
                                )}
                            </button>

                            {formState.status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-500/10 text-green-500 rounded-xl text-center font-medium"
                                >
                                    {formState.message}
                                </motion.div>
                            )}

                            {formState.status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-500/10 text-red-500 rounded-xl text-center font-medium"
                                >
                                    {formState.message}
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
