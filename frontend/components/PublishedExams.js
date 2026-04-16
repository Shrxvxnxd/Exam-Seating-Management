import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CaptchaModal from './CaptchaModal';
import { Calendar, Clock, ArrowRight, Users, GraduationCap, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/utils/config';
import { motion } from 'framer-motion';

export default function PublishedExams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [maintenanceInfo, setMaintenanceInfo] = useState({ message: '', description: '' });

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/exams/live`, { cache: 'no-store' });
                if (res.status === 503) {
                    const data = await res.json();
                    setMaintenanceInfo({
                        message: data.error || 'System Under Maintenance',
                        description: data.message || 'We are performing scheduled updates.'
                    });
                    setIsMaintenance(true);
                    setLoading(false);
                    return;
                }
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Oops, we didn't get JSON!");
                }
                const data = await res.json();
                setExams(data);
                setIsMaintenance(false);
            } catch (err) {
                console.error("Failed to fetch exams:", err.message);
                setExams(prev => (prev && prev.length > 0) ? prev : []);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
        const interval = setInterval(fetchExams, 5000); // Refresh every 5s

        return () => clearInterval(interval);
    }, []);

    // --- CAPTCHA STATE ---
    const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
    const [pendingUrl, setPendingUrl] = useState(null);
    const router = useRouter();

    const handleExamClick = (url) => {
        setPendingUrl(url);
        setIsCaptchaOpen(true);
    };

    const handleCaptchaVerify = (token) => {
        setIsCaptchaOpen(false);
        if (pendingUrl) {
            router.push(pendingUrl);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Schedule...</p>
        </div>
    );

    if (isMaintenance) return (
        <div className="text-center py-16 px-6 bg-rose-50 rounded-3xl border border-rose-100 shadow-sm">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <Calendar size={32} />
            </div>
            <p className="font-black text-xl text-rose-600 uppercase tracking-widest">
                System Under Maintenance
            </p>
            <p className="text-rose-400 text-sm mt-2 font-medium">{maintenanceInfo.description}</p>
        </div>
    );

    if (exams.length === 0) return (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Calendar size={32} />
            </div>
            <p className="font-black text-xl text-slate-300 uppercase tracking-widest">
                No active sessions
            </p>
            <p className="text-slate-400 text-sm mt-2 font-medium">There are no exams scheduled for today or upcoming.</p>
        </div>
    );

    return (
        <>
            <div className="grid grid-cols-1 gap-6">
                {exams.map((exam, idx) => {
                    const isLive = new Date(exam.date).toDateString() === new Date().toDateString();
                    const examDate = new Date(exam.date);
                    const targetUrl = `/student?exam=${encodeURIComponent(exam.name)}&date=${exam.date}`;

                    return (
                        <div
                            key={exam.id}
                            onClick={() => handleExamClick(targetUrl)}
                            className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                            {/* Status Stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isLive ? 'bg-emerald-500' : 'bg-slate-200 group-hover:bg-indigo-500'} transition-colors`}></div>

                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

                                {/* Date Badge */}
                                <div className={`flex-shrink-0 w-full sm:w-20 h-20 rounded-xl flex flex-col items-center justify-center border ${isLive ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'} transition-colors`}>
                                    <span className="text-[10px] uppercase font-black tracking-wider">{examDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-3xl font-black leading-none my-0.5">{examDate.getDate()}</span>
                                    <span className="text-[10px] font-bold opacity-60">{examDate.getFullYear()}</span>
                                </div>

                                {/* Main Details */}
                                <div className="flex-grow min-w-0">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {isLive && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 animate-pulse">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Now
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                                            <Clock size={10} /> {exam.time}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                        {exam.name}
                                    </h3>

                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <GraduationCap size={14} className="text-slate-400" />
                                            <span>Year: <span className="text-slate-700 font-bold">{exam.year || 'All'}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} className="text-slate-400" />
                                            <span>Branch: <span className="text-slate-700 font-bold">{exam.branch || 'Common'}</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0 mt-2 sm:mt-0">
                                    <div className="text-right hidden sm:block">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Academic Year</span>
                                        <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 block">
                                            {exam.academicYear || examDate.getFullYear()}
                                        </span>
                                    </div>

                                    <span className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-slate-900 sm:bg-white sm:text-slate-900 text-white sm:border sm:border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
                                        View Seating <ChevronRight size={14} className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <CaptchaModal
                isOpen={isCaptchaOpen}
                onClose={() => setIsCaptchaOpen(false)}
                onVerify={handleCaptchaVerify}
            />
        </>
    );
}
