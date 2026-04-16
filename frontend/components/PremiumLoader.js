'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function PremiumLoader({ text = "Loading", subText = "Please Wait" }) {
    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-xl z-[9999] flex flex-col items-center justify-center">
            {/* Animated Rings */}
            <div className="relative mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-[3px] border-slate-100 border-t-emerald-600 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-[3px] border-slate-100 border-b-indigo-600 rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center text-emerald-600"
                >
                    <Sparkles size={28} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                </motion.div>
            </div>

            {/* Text Animations */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">{text}</h2>
                <div className="flex items-center justify-center gap-3">
                    <motion.div
                        animate={{ width: [20, 40, 20] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-1 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
                    />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{subText}</p>
                    <motion.div
                        animate={{ width: [20, 40, 20] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                        className="h-1 bg-gradient-to-r from-teal-400 to-emerald-600 rounded-full"
                    />
                </div>
            </motion.div>

            {/* Premium Particles (Subtle) */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100],
                            x: [0, (i % 2 === 0 ? 50 : -50)],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                        }}
                        className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-emerald-400 rounded-full blur-[1px]"
                    />
                ))}
            </div>
        </div>
    );
}
