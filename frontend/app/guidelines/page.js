'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckSquare, AlertTriangle, Smartphone, Watch, Calculator, MicOff } from 'lucide-react';

export default function GuidelinesPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-purple-500/30 flex flex-col bg-[#050507] text-white">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="mb-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                                <ClipboardList size={14} />
                                Student Handbook
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Examination Guidelines</h1>
                            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                                Essential rules and instructions for a smooth examination experience. Please review them prior to every session.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#0A0A0C]/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5 space-y-12"
                    >
                        {/* Reporting Time */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-blue-400 border border-blue-500/10 shrink-0">
                                <Clock size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-100 mb-3">Reporting Time</h3>
                                <p className="text-gray-400 leading-relaxed mb-5">
                                    Students must be seated in the examination hall at least <strong className="text-white">15 minutes</strong> before the scheduled start time. Late entry up to 30 minutes may be permitted only with authorization from the Chief Superintendent.
                                </p>
                                <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-bold inline-block">
                                    No entry allowed after 30 minutes.
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* ID Cards */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-emerald-400 border border-emerald-500/10 shrink-0">
                                <CheckSquare size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-100 mb-3">Identity Verification</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    A valid <strong className="text-white">University ID Card</strong> and <strong className="text-white">Hall Ticket</strong> are mandatory for entry. Digital copies are NOT accepted unless explicitly authorized due to loss of physical card (Special Permission required).
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Prohibitions */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 text-amber-400 border border-amber-500/10 shrink-0">
                                <AlertTriangle size={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-100 mb-3">Prohibited Items</h3>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    The following items are strictly banned inside the hall:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-gray-300">
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <Smartphone size={18} className="text-gray-500" /> Mobile Phones
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <Watch size={18} className="text-gray-500" /> Smart Watches
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <MicOff size={18} className="text-gray-500" /> Bluetooth Devices
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <Calculator size={18} className="text-gray-500" /> Prog. Calculators
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Dress Code */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-purple-400 border border-purple-500/10 shrink-0">
                                <CheckSquare size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-100 mb-3">Dress Code</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Visual verification of identity is required. Students should adhere to the University's formal dress code. Masks or face coverings (unless medical) may need to be briefly removed for ID checks.
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Emergency Protocol */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 text-red-400 border border-red-500/10 shrink-0">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-100 mb-3">Emergency & Health</h3>
                                <p className="text-gray-400 leading-relaxed mb-3">
                                    If you feel unwell during the exam, raise your hand to alert the invigilator immediately.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400 text-sm">
                                    <li>Do not leave the hall without permission.</li>
                                    <li>Medical staff is available on standby during major examination sessions.</li>
                                </ul>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
