'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, Home, Users, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function AttendanceSuccessPage() {
    const router = useRouter();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('lastAttendanceSummary');
        if (data) {
            setSummary(JSON.parse(data));
        } else {
            router.replace('/faculty/dashboard');
        }
    }, [router]);

    if (!summary) return null;

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30 shadow-inner"
                    >
                        <Check size={40} strokeWidth={4} className="text-white drop-shadow-md" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold tracking-tight mb-2"
                    >
                        Attendance Submitted!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-green-100 font-medium"
                    >
                        The session record has been successfully saved.
                    </motion.p>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8">
                    {/* Session Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                                <Users size={20} />
                            </div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Class</p>
                            <p className="text-slate-800 font-bold truncate">{summary.subject}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600">
                                <Calendar size={20} />
                            </div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Date</p>
                            <p className="text-slate-800 font-bold">{new Date(summary.date).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-600">
                                <Clock size={20} />
                            </div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Period</p>
                            <p className="text-slate-800 font-bold">{summary.period}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${summary.absents.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                <AlertCircle size={20} />
                            </div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Absentees</p>
                            <p className={`font-bold ${summary.absents.length > 0 ? 'text-red-600' : 'text-green-600'}`}>{summary.absents.length}</p>
                        </div>
                    </div>

                    {/* Absentees List */}
                    {summary.absents.length > 0 ? (
                        <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6">
                            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                                Absent Students ({summary.absents.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {summary.absents.map((student, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (idx * 0.05) }}
                                        key={idx}
                                        className="bg-white p-3 rounded-xl border border-red-100 flex items-center justify-between shadow-sm"
                                    >
                                        <div>
                                            <p className="text-red-900 font-bold font-mono text-sm">{student.reg_no}</p>
                                            <p className="text-red-400 text-xs font-medium truncate max-w-[150px]">{student.name}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                            <AlertCircle size={16} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50/50 rounded-3xl border border-green-100 p-8 text-center">
                            <h3 className="text-xl font-bold text-green-800 mb-1">All Present! 🎉</h3>
                            <p className="text-green-600">Every student attended this session.</p>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                        <button
                            onClick={() => router.push('/faculty/dashboard')}
                            className="flex-1 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
