'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Calendar, Clock, Users, BookOpen, AlertCircle, Check } from 'lucide-react';

export default function FacultyDashboard() {
    const router = useRouter();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [facultyName, setFacultyName] = useState('');
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('classes');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionDetails, setSessionDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('facultyToken');
        const name = localStorage.getItem('facultyName');

        if (!token) {
            router.push('/faculty/login');
            return;
        }
        setFacultyName(name || 'Faculty');
        setIsMounted(true);

        // Initialize greeting and time immediately
        updateTimeAndGreeting();

        // Update every minute (on the minute for better accuracy)
        const timer = setInterval(updateTimeAndGreeting, 60000);

        fetchAssignments(token);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, selectedDate]);

    const updateTimeAndGreeting = () => {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const fetchAssignments = async (token) => {
        try {
            const res = await fetch('http://localhost:5000/api/faculty/assignments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAssignments(data);
            } else {
                if (res.status === 401 || res.status === 403) router.push('/faculty/login');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        const token = localStorage.getItem('facultyToken');
        setHistoryLoading(true);
        try {
            let url = 'http://localhost:5000/api/faculty/history';
            if (selectedDate) url += `?date=${selectedDate}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const openSessionDetails = async (record) => {
        setSelectedSession(record);
        setDetailsLoading(true);
        try {
            const token = localStorage.getItem('facultyToken');
            const res = await fetch(`http://localhost:5000/api/faculty/history/details?date=${record.date}&subject=${encodeURIComponent(record.subject)}&period=${record.period}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSessionDetails(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('facultyToken');
        localStorage.removeItem('facultyName');
        router.push('/faculty/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20"
                        >
                            F
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                                Faculty Portal
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">Exam Management System</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-semibold text-slate-700">{facultyName}</span>
                            <span className="text-xs text-slate-500">Faculty Member</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="group relative px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 overflow-hidden"
                        >
                            <span className="relative z-10">Sign Out</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">

                {/* Hero Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-4xl font-bold text-slate-800">
                                {isMounted ? greeting : 'Hello'}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{facultyName.split(' ')[0]}</span>
                            </h2>
                            {isMounted && currentTime && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white shadow-sm border border-slate-200 rounded-2xl text-slate-500 font-bold text-sm">
                                    <Clock size={14} className="text-blue-500" />
                                    {currentTime}
                                </div>
                            )}
                        </div>
                        <p className="text-slate-500 text-lg">
                            {activeTab === 'classes' ? 'Here are your assigned classes for today.' : 'View your past attendance records.'}
                        </p>
                    </motion.div>

                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex shrink-0">
                        <button
                            onClick={() => setActiveTab('classes')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeTab === 'classes' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {activeTab === 'classes' && (
                                <motion.div layoutId="tab-bg" className="absolute inset-0 bg-blue-50 rounded-xl" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                            )}
                            <span className="relative z-10">My Classes</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeTab === 'history' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {activeTab === 'history' && (
                                <motion.div layoutId="tab-bg" className="absolute inset-0 bg-blue-50 rounded-xl" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                            )}
                            <span className="relative z-10">History</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === 'history' ? (
                    <div className="space-y-6">
                        {/* History Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto self-start"
                        >
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <label className="text-sm font-bold text-slate-600">Filter by Date:</label>
                            <input
                                type="date"
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            {selectedDate && (
                                <button onClick={() => setSelectedDate('')} className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 px-3 py-2 rounded-lg transition-colors">
                                    Clear
                                </button>
                            )}
                        </motion.div>

                        {historyLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-white rounded-3xl border border-slate-200 animate-pulse"></div>
                                ))}
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-slate-500 font-medium text-lg">No attendance records found.</p>
                                <p className="text-slate-400 text-sm mt-1">Try selecting a different date.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {history.map((record, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => openSessionDetails(record)}
                                        className="group bg-white p-5 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(record.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-2xl font-bold leading-none">{new Date(record.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {record.branch && (
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                            {record.branch} {record.section ? `- ${record.section}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors leading-tight">{record.subject || 'Unknown Subject'}</h3>
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1.5">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 uppercase font-bold text-[10px] tracking-wide">Period {record.period}</span>
                                                    <span>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    {record.submission_time && (
                                                        <span className="flex items-center gap-1 text-slate-400 font-normal border-l border-slate-200 pl-2 ml-1">
                                                            <Clock size={12} />
                                                            {new Date(record.submission_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 pl-4 md:pl-0 border-l md:border-l-0 border-slate-100">
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance</div>
                                                <div className="flex items-baseline gap-1 justify-end">
                                                    <span className="text-2xl font-bold text-slate-800">
                                                        {parseInt(record.total_students) - parseInt(record.absent_count)}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-400">/ {record.total_students}</span>
                                                </div>
                                            </div>

                                            <div className="text-right min-w-[60px]">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Absentees</div>
                                                <div className={`text-2xl font-bold ${parseInt(record.absent_count) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                    {record.absent_count}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

                {/* Dashboard Grid (Hidden when history is active) */}
                {activeTab === 'classes' && (


                    loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse p-6">
                                    <div className="h-6 w-24 bg-slate-100 rounded-full mb-4"></div>
                                    <div className="h-8 w-3/4 bg-slate-100 rounded-lg mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-full bg-slate-100 rounded"></div>
                                        <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : assignments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Active Assignments</h3>
                            <p className="text-slate-500 mb-6">You don't have any classes assigned at the moment.</p>
                            <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                Refresh Dashboard
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {assignments.map((assignment, idx) => (
                                    <motion.div
                                        key={assignment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer flex flex-col"
                                        onClick={() => router.push(`/faculty/attendance?id=${assignment.id}&subject=${encodeURIComponent(assignment.subject)}&branch=${encodeURIComponent(assignment.branch)}&section=${encodeURIComponent(assignment.section || '')}&period=${encodeURIComponent(assignment.period || '')}&room=${encodeURIComponent(assignment.room_no || '')}`)}
                                    >
                                        {/* Decorative top bar */}
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                                        {assignment.branch}
                                                    </span>
                                                    {assignment.day_of_week && (
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{assignment.day_of_week}</span>
                                                    )}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                {assignment.subject || 'General Session'}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">Y{assignment.year?.toString().charAt(0)}</div>
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">{assignment.section?.charAt(0) || 'A'}</div>
                                                </div>
                                                <span className="text-xs font-semibold text-slate-400">{assignment.year} Year • Sec {assignment.section || 'All'}</span>
                                            </div>

                                            <div className="space-y-2.5">
                                                {assignment.period && (
                                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50/50 transition-colors border border-transparent group-hover:border-blue-100/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500">
                                                                <Clock size={14} />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-600">Period</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-800">{assignment.period}</span>
                                                    </div>
                                                )}

                                                {assignment.room_no && (
                                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50/50 transition-colors border border-transparent group-hover:border-indigo-100/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-500">
                                                                <BookOpen size={14} />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-600">Room</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-800">{assignment.room_no}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-300 mt-auto">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-white/80 transition-colors">Take Attendance</span>
                                            <div className="w-6 h-6 rounded-lg bg-white/0 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                )}
            </main>
            {/* Session Details Modal */}
            <AnimatePresence>
                {selectedSession && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            Period {selectedSession.period}
                                        </span>
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            {new Date(selectedSession.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{selectedSession.subject || 'Session Details'}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedSession(null)}
                                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {detailsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-slate-500 font-medium">Loading records...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
                                                <span className="text-emerald-600 font-bold text-3xl">{sessionDetails.filter(s => s.status === 'Present').length}</span>
                                                <span className="text-emerald-700/70 text-xs font-bold uppercase tracking-wider">Present</span>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center text-center">
                                                <span className="text-red-500 font-bold text-3xl">{sessionDetails.filter(s => s.status === 'Absent').length}</span>
                                                <span className="text-red-700/70 text-xs font-bold uppercase tracking-wider">Absent</span>
                                            </div>
                                        </div>

                                        {/* Student List */}
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                                                <span>Student Records</span>
                                                <span className="text-slate-400 font-normal text-xs">{sessionDetails.length} Students</span>
                                            </h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {sessionDetails.map((student, idx) => {
                                                    const isAbsent = student.status === 'Absent';
                                                    return (
                                                        <div key={idx} className={`p-3 rounded-xl border flex items-center gap-3 ${isAbsent ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isAbsent ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                                {isAbsent ? <X size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-sm font-bold font-mono ${isAbsent ? 'text-red-900' : 'text-slate-700'}`}>{student.student_reg}</p>
                                                                {student.remarks && (
                                                                    <p className="text-xs text-amber-600 font-medium mt-0.5 truncate flex items-center gap-1">
                                                                        <AlertCircle size={10} /> {student.remarks}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                                <button
                                    onClick={() => setSelectedSession(null)}
                                    className="px-6 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
