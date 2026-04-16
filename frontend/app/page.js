'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Search, Users, Calendar, Clock, MapPin, Sparkles, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/config';
import MaintenanceScreen from '../components/MaintenanceScreen';
import PublishedExams from '../components/PublishedExams';
import Footer from '../components/Footer';

export default function Home() {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [maintenanceInfo, setMaintenanceInfo] = useState({ message: '', description: '' });

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/exams/live`, { cache: 'no-store' });
                if (res.status === 503) {
                    const data = await res.json();
                    setMaintenanceInfo({
                        message: data.error || 'System Under Maintenance',
                        description: data.message || ''
                    });
                    setIsMaintenance(true);
                } else if (res.status === 200 || res.ok) {
                    setIsMaintenance(false);
                }
            } catch (err) {
                // Silently ignore failures
            }
        };

        checkMaintenance();
        const interval = setInterval(checkMaintenance, 5000); // Check every 5s (Stable Fast!)
        return () => clearInterval(interval);
    }, []);

    if (isMaintenance) return <MaintenanceScreen message={maintenanceInfo.message} description={maintenanceInfo.description} />;

    return (
        <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48 overflow-hidden">
                    {/* Background Noise & Gradients */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/4" />

                    <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 px-5 py-2 rounded-full text-[11px] font-black tracking-widest uppercase mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
                                <Sparkles size={12} className="text-amber-500" />
                                <span>Next-Gen Student Portal</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 md:mb-8 tracking-tighter">
                                Intelligent Seating. <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Seamless Management.</span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12 px-2">
                                Experience the future of examination logistics with real-time seat allocation, dynamic hall tickets, and smart scheduling.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-5">
                                <Link href="/student" className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        Find My Seat <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link href="/faculty/login" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3">
                                    <ShieldCheck size={20} className="text-slate-400 group-hover:text-slate-600" />
                                    <span>Faculty Login</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- How It Works Section --- */}
                <section className="py-24 bg-slate-50 border-y border-slate-200/60 relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Streamlined Process</h2>
                            <p className="text-slate-500 text-lg">Your journey from login to exam hall in three simple steps.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Login Securely", desc: "Access the portal with your university credentials.", icon: <ShieldCheck size={24} /> },
                                { step: "02", title: "Find Seating", desc: "Enter your registration number to view your hall ticket.", icon: <Search size={24} /> },
                                { step: "03", title: "Take Exam", desc: "Navigate to your allocated room with floor plans.", icon: <MapPin size={24} /> }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="text-[100px] leading-none font-black text-slate-100 absolute top-4 right-6 select-none group-hover:text-indigo-50 transition-colors pointer-events-none">
                                        {item.step}
                                    </div>
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 relative z-10 text-slate-900 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3 relative z-10">{item.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed relative z-10">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Dashboard Modules Preview --- */}
                <section className="py-32 bg-white container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-4">
                                <Sparkles size={12} />
                                <span>Core Modules</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Everything You Need</h2>
                            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                                A unified dashboard giving you instant access to all examination essentials.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Room Allotment Card - Active */}
                            <Link href="/student" className="group block h-full">
                                <div className="bg-slate-900 text-white p-8 rounded-[2rem] h-full relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                                        <MapPin size={28} className="text-indigo-300" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-3">Room Allotment</h3>
                                    <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                                        Instantly find your exam hall, seat number, and view detailed floor plans.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-300 mt-auto">
                                        Access Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>

                            {/* Attendance Card - Coming Soon */}
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-full relative overflow-hidden group cursor-default hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="absolute top-6 right-6 px-3 py-1 bg-slate-200 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-500">Coming Soon</div>
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                                    <Clock size={28} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3">Attendance</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Track your comprehensive exam attendance record and eligibility status in real-time.
                                </p>
                            </div>

                            {/* Results Card - Coming Soon */}
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-full relative overflow-hidden group cursor-default hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="absolute top-6 right-6 px-3 py-1 bg-slate-200 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-500">Coming Soon</div>
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                                    <GraduationCap size={28} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3">Results</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    View your semester results, download grade sheets, and analyze academic performance.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
