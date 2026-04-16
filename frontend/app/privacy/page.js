'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { Lock, Eye, Database, ShieldCheck, Server, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-purple-500/30 flex flex-col bg-[#050507] text-white">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="mb-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                                <Lock size={14} />
                                Data Protection
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Privacy Policy</h1>
                            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                                We value your trust. Learn how we collect, use, and protect your academic and personal data within the Student Portal.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#0A0A0C]/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5 space-y-12"
                    >
                        {/* Section 1 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Database size={24} /></div>
                                1. Information We Collect
                            </h2>
                            <div className="pl-0 md:pl-20">
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    The Student Portal collects minimal personal data required for examination administration. We ensure transparency in what we gather:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 text-white font-semibold mb-2">
                                            <UserCheck size={16} className="text-purple-400" />
                                            Identity Data
                                        </div>
                                        <p className="text-sm text-gray-400">Microsoft Profile (Name, Email), Register Number, Branch</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 text-white font-semibold mb-2">
                                            <Server size={16} className="text-blue-400" />
                                            Technical Data
                                        </div>
                                        <p className="text-sm text-gray-400">IP Address, Login Timestamps, Browser Type</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 2 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Eye size={24} /></div>
                                2. How We Use Your Data
                            </h2>
                            <div className="pl-0 md:pl-20 text-gray-400 space-y-4">
                                <p>Your data is used strictly for academic administration purposes:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        Generating accurate seating plans and hall tickets.
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        Processing and publishing examination results.
                                    </li>
                                </ul>

                                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                                        <Server size={16} /> Microsoft Integration
                                    </h4>
                                    <p className="text-xs leading-relaxed text-blue-200/70">
                                        We use Microsoft Graph API solely for authentication and reading basic profile info (User.Read scope). We <strong>never</strong> access your emails, files, or calendar, nor do we store your Microsoft password.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 3 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><ShieldCheck size={24} /></div>
                                3. Data Security & Sharing
                            </h2>
                            <div className="pl-0 md:pl-20">
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    We implement industrial-grade security measures to protect your data from unauthorized access.
                                </p>
                                <div className="bg-amber-500/10 text-amber-200/80 p-6 rounded-2xl border border-amber-500/20">
                                    <strong>Strict No-Share Policy:</strong> We do NOT sell, trade, or share student data with third-party advertisers or external organizations. Access is restricted exclusively to authorized university faculty and examination cell staff.
                                </div>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20"><Server size={24} /></div>
                                4. Data Retention
                            </h2>
                            <div className="pl-0 md:pl-20">
                                <p className="text-gray-400 leading-relaxed">
                                    Student data is retained only for the duration of your academic program plus one academic year for record-checking purposes. Afterward, personal identifiers are anonymized for statistical analysis.
                                </p>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 5 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Database size={24} /></div>
                                5. Cookies & Local Storage
                            </h2>
                            <div className="pl-0 md:pl-20">
                                <p className="text-gray-400 leading-relaxed">
                                    This portal uses local storage and essential session cookies solely to maintain your login state and theme preferences. We do <strong>not</strong> use tracking cookies or third-party analytics scripts.
                                </p>
                            </div>
                        </section>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
