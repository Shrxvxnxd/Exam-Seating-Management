'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, Shield } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Small delay for better UX on initial load
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 md:bottom-8 md:right-8 md:left-auto md:w-[480px] z-[100] p-4 md:p-0"
                >
                    <div className="bg-[#0A0A0C]/90 backdrop-blur-2xl border-t md:border border-white/10 rounded-t-3xl md:rounded-2xl shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)] p-6 md:p-7 relative overflow-hidden group">

                        {/* Gradient Border Glow */}
                        <div className="absolute inset-0 rounded-t-3xl md:rounded-2xl border border-white/5 pointer-events-none" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

                        {/* Decorative Background Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-5">
                            {/* Icon Column */}
                            <div className="hidden md:block">
                                <div className="p-3.5 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 shadow-inner text-purple-300">
                                    <Cookie size={28} />
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2 md:mb-1">
                                        <div className="md:hidden p-2 bg-white/10 rounded-lg text-purple-300">
                                            <Cookie size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">
                                            Cookie Preferences
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                        We use essential cookies to maintain your session and theme preferences. We respect your privacy and do not track you for advertising.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="relative overflow-hidden bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-lg shadow-white/5"
                                    >
                                        <Check size={16} className="text-emerald-600" />
                                        Accept All
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="bg-white/5 text-gray-300 font-medium py-3 px-4 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/5 active:scale-95 flex items-center justify-center gap-2 text-sm backdrop-blur-sm"
                                    >
                                        <X size={16} />
                                        Reject Optional
                                    </button>
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <a href="/privacy" className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1.5 group/link">
                                        <Shield size={12} className="group-hover/link:text-purple-400 transition-colors" />
                                        <span>Privacy Policy</span>
                                    </a>
                                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
                                        Ver 2.0 Secure
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
