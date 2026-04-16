'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    Clock,
    Edit2,
    Send,
    Users,
    Book,
    Monitor,
    GraduationCap,
    ChevronLeft,
    Search,
    AlertCircle,
    Calendar,
    Save
} from 'lucide-react';

export default function AttendancePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const assignmentId = searchParams.get('id');
    const subjectName = searchParams.get('subject') || 'Your Class';
    const initialPeriod = searchParams.get('period');
    const roomNo = searchParams.get('room');

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Session Info
    const [period, setPeriod] = useState(initialPeriod || '1');
    const [teachingMethod, setTeachingMethod] = useState('Blackboard');
    const [topic, setTopic] = useState('');

    const [searchQuery, setSearchQuery] = useState('');

    // Submission & Review
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Remarks Modal
    const [editingStudent, setEditingStudent] = useState(null);
    const [tempRemark, setTempRemark] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('facultyToken');
        if (!token) {
            router.push('/faculty/login');
            return;
        }
        if (assignmentId) {
            fetchStudents(token);
        }
    }, [assignmentId]);

    const fetchStudents = async (token) => {
        try {
            const res = await fetch('http://localhost:5000/api/faculty/fetch-students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignment_id: assignmentId })
            });

            if (res.ok) {
                const data = await res.json();
                const initialized = data.map(s => ({
                    ...s,
                    status: 'Present',
                    remarks: ''
                }));
                initialized.sort((a, b) => a.reg_no.localeCompare(b.reg_no, undefined, { numeric: true }));
                setStudents(initialized);
            } else {
                alert('Failed to load students');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = (id) => {
        setStudents(prev => prev.map(s => {
            if (s.id === id) {
                const newStatus = s.status === 'Present' ? 'Absent' : 'Present';
                return { ...s, status: newStatus, remarks: newStatus === 'Present' ? '' : s.remarks };
            }
            return s;
        }));
    };

    const markAll = (status) => {
        if (!confirm(`Mark ALL students as ${status}?`)) return;
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const openRemarks = (e, student) => {
        e.stopPropagation();
        setEditingStudent(student.id);
        setTempRemark(student.remarks || '');
    };

    const saveRemark = () => {
        setStudents(prev => prev.map(s => s.id === editingStudent ? { ...s, remarks: tempRemark } : s));
        setEditingStudent(null);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('facultyToken');
        setSubmitStatus('loading');

        try {
            const records = students.map(s => ({
                student_reg: s.reg_no,
                status: s.status,
                remarks: s.remarks
            }));

            const res = await fetch('http://localhost:5000/api/faculty/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    assignment_id: assignmentId,
                    date: new Date().toISOString().split('T')[0],
                    records,
                    period,
                    teaching_method: teachingMethod,
                    topic
                })
            });

            if (res.ok) {
                setSubmitStatus('success');

                // Save Summary for Success Page
                const absentsList = students.filter(s => s.status === 'Absent').map(s => ({ reg_no: s.reg_no, name: s.full_name }));
                const summaryData = {
                    subject: subjectName,
                    date: new Date().toISOString(),
                    period,
                    absents: absentsList
                };
                localStorage.setItem('lastAttendanceSummary', JSON.stringify(summaryData));

                setTimeout(() => {
                    setShowReviewModal(false);
                    setSubmitStatus(null);
                    router.push('/faculty/attendance/success');
                }, 1000);
            } else {
                setSubmitStatus('error');
            }
        } catch (err) {
            setSubmitStatus('error');
        }
    };

    const absents = students.filter(s => s.status === 'Absent');
    const presentCount = students.length - absents.length;

    const displayStudents = students.filter(s =>
        s.reg_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.full_name && s.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const methods = ['Blackboard', 'PowerPoint', 'Seminar', 'Lab Session', 'Online', 'Other'];

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-600 font-semibold animate-pulse">Loading Class Data...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/30">
                                        <GraduationCap size={20} className="text-white" />
                                    </div>
                                    <h1 className="text-xl font-bold text-slate-900">Session Attendance</h1>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    {roomNo && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5">
                                                <Monitor size={14} />
                                                Room {roomNo}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                        >
                            <span>Review & Submit</span>
                            {absents.length > 0 && (
                                <span className="px-2 py-0.5 bg-white/20 rounded-lg text-sm">
                                    {absents.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="mt-5 flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <Clock size={16} className="text-slate-400" />
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="bg-transparent font-medium text-slate-700 outline-none"
                                disabled={!!initialPeriod}
                            >
                                {initialPeriod ? (
                                    <option value={initialPeriod}>Period {initialPeriod}</option>
                                ) : (
                                    [1, 2, 3, 4, 5, 6, 7, 8, 'Lab'].map(p => <option key={p} value={p}>Period {p}</option>)
                                )}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <Monitor size={16} className="text-slate-400" />
                            <select
                                value={teachingMethod}
                                onChange={(e) => setTeachingMethod(e.target.value)}
                                className="bg-transparent font-medium text-slate-700 outline-none"
                            >
                                {methods.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[250px] relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-12 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => markAll('Present')}
                            className="px-4 py-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-600 font-medium shadow-sm transition-all"
                        >
                            Reset All
                        </button>
                        <button
                            onClick={() => markAll('Absent')}
                            className="px-4 py-2.5 bg-white hover:bg-red-50 rounded-xl border border-red-200 text-red-600 font-medium shadow-sm transition-all"
                        >
                            Mark All Absent
                        </button>
                    </div>

                    {/* Topic Input */}
                    <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-white/50 rounded-xl border border-slate-200/60">
                        <Book size={16} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Topic covered in this session (optional)..."
                            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-sm font-semibold text-slate-600">
                            {students.length} Students
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-emerald-700">{presentCount} Present</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-red-700">{absents.length} Absent</span>
                            </div>
                        </div>
                    </div>

                    {/* Student Grid */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.008 } }
                        }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-3"
                    >
                        {displayStudents.map((student) => {
                            const isAbsent = student.status === 'Absent';
                            return (
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 8 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    key={student.id}
                                    onClick={() => toggleStatus(student.id)}
                                    className={`
                                        relative cursor-pointer select-none rounded-2xl p-4 transition-all duration-200
                                        ${isAbsent
                                            ? 'bg-red-50 border-2 border-red-200 shadow-sm'
                                            : 'bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg shadow-sm'
                                        }
                                    `}
                                >
                                    {/* Status Badge */}
                                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isAbsent ? 'bg-red-500' : 'bg-emerald-500'
                                        }`}>
                                        {isAbsent ? <X size={14} className="text-white" strokeWidth={3} /> : <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col items-center text-center pt-4">
                                        <div className={`font-mono text-sm font-bold mb-2 ${isAbsent ? 'text-red-900' : 'text-slate-900'
                                            }`}>
                                            {student.reg_no}
                                        </div>
                                        {student.full_name !== 'Not Registered' && (
                                            <div className={`text-xs font-medium truncate w-full ${isAbsent ? 'text-red-700/70' : 'text-slate-500'
                                                }`}>
                                                {student.full_name?.split(' ')[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Remark Indicator */}
                                    {student.remarks && (
                                        <div className="absolute top-2 left-2 w-2 h-2 bg-amber-500 rounded-full" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {displayStudents.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-600 mb-1">No students found</h3>
                            <p className="text-slate-400">Try adjusting your search query</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => setShowReviewModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-slate-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Review Attendance</h2>
                                        <p className="text-slate-500 mt-1">Confirm details before submission</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-blue-600">{presentCount}<span className="text-slate-300 text-2xl">/{students.length}</span></div>
                                        <div className="text-xs font-semibold text-slate-400 uppercase">Present</div>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="space-y-6">
                                    {/* Session Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <div className="text-xs text-slate-500 font-medium mb-1">Period</div>
                                            <div className="font-semibold text-slate-900">{period}</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <div className="text-xs text-slate-500 font-medium mb-1">Method</div>
                                            <div className="font-semibold text-slate-900">{teachingMethod}</div>
                                        </div>
                                        {topic && (
                                            <div className="col-span-2 p-4 bg-blue-50 rounded-xl">
                                                <div className="text-xs text-blue-600 font-medium mb-1">Topic</div>
                                                <div className="font-semibold text-blue-900">{topic}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Absentees */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Absentees ({absents.length})</h4>
                                        {absents.length === 0 ? (
                                            <div className="text-center py-8 bg-emerald-50 rounded-xl">
                                                <Check size={32} className="text-emerald-500 mx-auto mb-2" />
                                                <p className="text-emerald-700 font-semibold">Perfect Attendance!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {absents.map((s) => (
                                                    <div key={s.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                                                        <div>
                                                            <div className="font-mono font-semibold text-slate-900">{s.reg_no}</div>
                                                            <div className="text-sm text-slate-500">{s.full_name}</div>
                                                        </div>
                                                        {s.remarks && (
                                                            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                                                {s.remarks}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowReviewModal(false)}
                                        className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-white transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitStatus === 'loading'}
                                        className={`flex-1 py-3 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${submitStatus === 'loading'
                                                ? 'bg-blue-400'
                                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                            }`}
                                    >
                                        {submitStatus === 'loading' ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Submit Attendance</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Remarks Modal */}
            <AnimatePresence>
                {editingStudent && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => setEditingStudent(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Add Remark</h3>
                                <button
                                    onClick={() => setEditingStudent(null)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                                <div className="text-xs text-slate-500 font-medium mb-1">Student</div>
                                <div className="font-mono font-bold text-slate-900 text-lg">
                                    {(students.find(s => s.id === editingStudent) || {}).reg_no}
                                </div>
                            </div>

                            <textarea
                                className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all min-h-[120px] resize-none"
                                placeholder="Enter reason for absence..."
                                value={tempRemark}
                                onChange={(e) => setTempRemark(e.target.value)}
                                autoFocus
                            />

                            <button
                                onClick={saveRemark}
                                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                <span>Save Remark</span>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
