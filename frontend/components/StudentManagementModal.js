'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Edit2, Check, AlertTriangle, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { API_BASE_URL } from '../utils/config';

export default function StudentManagementModal({ isOpen, onClose }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [notification, setNotification] = useState(null);

    // Edit State
    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({
        full_name: '',
        branch: '',
        section: '',
        current_year: '',
        academic_start: '',
        academic_end: ''
    });

    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        setUserRole(localStorage.getItem('role'));
    }, [isOpen]);

    useEffect(() => {
        // ... (existing logging)
        if (isOpen) {
            // ... (existing logging)
            fetchStudents();
        }
    }, [isOpen, page, search]);

    // ... (Debounce search effect unchanged)

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ page, limit: 10 });
            if (search) query.append('search', search);

            const url = `${API_BASE_URL}/api/admin/students?${query.toString()}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                const data = await res.json();
                setStudents(data.students);
                setTotalPages(data.totalPages);
            } else {
                const text = await res.text();
                console.error('StudentManagementModal: Fetch failed', { status: res.status, statusText: res.statusText, text });
            }
        } catch (e) {
            console.error('StudentManagementModal: Fetch error', e);
        } finally {
            setLoading(false);
        }
    };

    // ... (handleEditClick and handleUpdate unchanged)

    // ... (useEffect for notification unchanged)

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {/* ... (Modal wrapper unchanged) */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* ... (Header unchanged) */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <GraduationCap className="text-blue-600" /> Student Management
                        </h2>
                        <p className="text-sm text-slate-500">View and Edit Student Academic Details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col">

                    {notification && (
                        <div className={`mb-4 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {notification.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                            {notification.message}
                        </div>
                    )}

                    {!editingStudent ? (
                        <>
                            {/* Toolbar */}
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by Reg No, Name, or Branch..."
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Reg No</th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Branch</th>
                                            <th className="px-4 py-3">Year</th>
                                            <th className="px-4 py-3">Section</th>
                                            {userRole !== 'view_only' && <th className="px-4 py-3 text-right">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan={userRole === 'view_only' ? 5 : 6} className="p-8 text-center text-slate-400">Loading...</td></tr>
                                        ) : students.length === 0 ? (
                                            <tr><td colSpan={userRole === 'view_only' ? 5 : 6} className="p-8 text-center text-slate-400">No students found.</td></tr>
                                        ) : (
                                            students.map(student => (
                                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3 font-mono text-slate-600">{student.reg_no}</td>
                                                    <td className="px-4 py-3 font-bold text-slate-700">{student.full_name}</td>
                                                    <td className="px-4 py-3">{student.branch}</td>
                                                    <td className="px-4 py-3">{student.current_year}</td>
                                                    <td className="px-4 py-3">{student.section}</td>
                                                    {userRole !== 'view_only' && (
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={() => handleEditClick(student)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                                title="Edit Details"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(page + 1)}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-2xl mx-auto w-full">
                            <div className="flex items-center gap-2 mb-6">
                                <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600">
                                    <ChevronLeft size={20} />
                                </button>
                                <h3 className="text-lg font-bold text-slate-800">Edit Student: {editingStudent.reg_no}</h3>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={editForm.full_name}
                                        onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Branch</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                            value={editForm.branch}
                                            onChange={e => setEditForm({ ...editForm, branch: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                            value={editForm.section}
                                            onChange={e => setEditForm({ ...editForm, section: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Year</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                            value={editForm.current_year}
                                            onChange={e => setEditForm({ ...editForm, current_year: e.target.value })}
                                            placeholder="e.g. 3rd Year"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Acad Start</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                            value={editForm.academic_start}
                                            onChange={e => setEditForm({ ...editForm, academic_start: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Acad End</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                            value={editForm.academic_end}
                                            onChange={e => setEditForm({ ...editForm, academic_end: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditingStudent(null)}
                                        className="flex-1 py-3 text-slate-600 bg-slate-100 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 text-white bg-blue-600 font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                                    >
                                        Update Student
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
