'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, BookOpen, Users, Trash2, Check, AlertTriangle, Edit2, RotateCcw } from 'lucide-react';
import { API_BASE_URL } from '../utils/config';

export default function FacultyManagementModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('create'); // create, assign, list
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [facultyList, setFacultyList] = useState([]);

    // Edit States
    const [editingFacultyId, setEditingFacultyId] = useState(null);
    const [editingAssignmentId, setEditingAssignmentId] = useState(null);

    // Forms
    const [createForm, setCreateForm] = useState({
        username: '', password: '', full_name: '', email: '', department: '', employee_id: ''
    });

    const [assignForm, setAssignForm] = useState({
        faculty_id: '', branch: 'CSE', section: 'All', year: '3', subject: '', start_reg: '', end_reg: '', excluded_reg: '',
        period: '', room_no: '', day_of_week: ''
    });

    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        if (role === 'view_only' && (activeTab === 'create' || activeTab === 'assign')) {
            setActiveTab('list');
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && (activeTab === 'list' || activeTab === 'assign' || activeTab === 'create')) { // Refresh list often
            fetchFaculty();
        }
    }, [isOpen, activeTab]);

    const fetchFaculty = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/faculty`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setFacultyList(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    const resetCreateForm = () => {
        setCreateForm({ username: '', password: '', full_name: '', email: '', department: '', employee_id: '' });
        setEditingFacultyId(null);
    };

    const resetAssignForm = () => {
        setAssignForm({ faculty_id: '', branch: 'CSE', section: 'All', year: '3', subject: '', start_reg: '', end_reg: '', excluded_reg: '', period: '', room_no: '', day_of_week: '' });
        setEditingAssignmentId(null);
    };

    // --- Actions ---

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingFacultyId
                ? `${API_BASE_URL}/api/admin/faculty/${editingFacultyId}`
                : `${API_BASE_URL}/api/admin/faculty`;

            const method = editingFacultyId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(createForm)
            });
            const data = await res.json();
            if (res.ok) {
                setNotification({ type: 'success', message: editingFacultyId ? 'Faculty Updated!' : 'Faculty Account Created!' });
                resetCreateForm();
                fetchFaculty();
                if (editingFacultyId) setActiveTab('list'); // Go back to list after edit
            } else {
                setNotification({ type: 'error', message: data.error });
            }
        } catch (err) {
            setNotification({ type: 'error', message: 'Server Error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignOrUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...assignForm,
                // Parse excluded Reg (comma separated)
                excluded_reg: assignForm.excluded_reg.split(',').map(r => r.trim()).filter(r => r)
            };

            const url = editingAssignmentId
                ? `${API_BASE_URL}/api/admin/faculty/assignment/${editingAssignmentId}`
                : `${API_BASE_URL}/api/admin/faculty/assign`;

            const method = editingAssignmentId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setNotification({ type: 'success', message: editingAssignmentId ? 'Assignment Updated!' : 'Class Assigned Successfully!' });
                resetAssignForm();
                fetchFaculty();
                if (editingAssignmentId) setActiveTab('list'); // Go back to list
            } else {
                const data = await res.json();
                setNotification({ type: 'error', message: data.error });
            }
        } catch (err) {
            setNotification({ type: 'error', message: 'Server Error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFaculty = async (id) => {
        if (!confirm('Are you sure you want to delete this faculty member? This will delete all their assignments and attendance records.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/faculty/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setNotification({ type: 'success', message: 'Faculty Deleted' });
                fetchFaculty();
            } else {
                alert('Failed to delete');
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteAssignment = async (id) => {
        if (!confirm('Delete this assignment? Attendance records linked to it will be removed.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/faculty/assignment/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setNotification({ type: 'success', message: 'Assignment Deleted' });
                fetchFaculty();
            } else {
                alert('Failed to delete');
            }
        } catch (err) { console.error(err); }
    };

    // --- Prep Helpers ---

    const startEditFaculty = (faculty) => {
        setEditingFacultyId(faculty.id);
        setCreateForm({
            username: faculty.username,
            password: '', // Leave blank to keep unchanged
            full_name: faculty.full_name,
            email: faculty.email || '',
            department: faculty.department || '',
            employee_id: faculty.employee_id
        });
        setActiveTab('create');
    };

    const startEditAssignment = (assignment, facultyId) => {
        setEditingAssignmentId(assignment.id);
        setAssignForm({
            faculty_id: facultyId,
            branch: assignment.branch,
            section: assignment.section || 'All',
            year: assignment.year,
            subject: assignment.subject || '',
            start_reg: assignment.start_reg || '',
            end_reg: assignment.end_reg || '',
            excluded_reg: assignment.excluded_reg ? (Array.isArray(assignment.excluded_reg) ? assignment.excluded_reg.join(', ') : assignment.excluded_reg) : '',
            period: assignment.period || '',
            room_no: assignment.room_no || '',
            day_of_week: assignment.day_of_week || ''
        });
        setActiveTab('assign');
    };

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const t = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(t);
        }
    }, [notification]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Faculty Management</h2>
                            <p className="text-sm text-slate-500">Create accounts • Assign Classes • Manage</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-64 bg-slate-50 p-4 border-r border-slate-100 flex flex-col gap-2 shrink-0">
                            {userRole !== 'view_only' && (
                                <>
                                    <button
                                        onClick={() => { setActiveTab('create'); resetCreateForm(); }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'create' ? 'bg-white shadow-sm text-blue-600 ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        <UserPlus size={18} /> {editingFacultyId ? 'Update Faculty' : 'Create Faculty'}
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('assign'); resetAssignForm(); }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'assign' ? 'bg-white shadow-sm text-blue-600 ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        <BookOpen size={18} /> {editingAssignmentId ? 'Update Assignment' : 'Assign Class'}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => { setActiveTab('list'); fetchFaculty(); }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-blue-600 ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <Users size={18} /> View Faculty List
                            </button>
                        </div>

                        {/* Main View */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            {notification && (
                                <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {notification.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                                    {notification.message}
                                </div>
                            )}

                            {activeTab === 'create' && (
                                <form onSubmit={handleCreateOrUpdate} className="max-w-lg space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg text-slate-700">{editingFacultyId ? 'Update Faculty Details' : 'New Faculty Account'}</h3>
                                        {editingFacultyId && <button type="button" onClick={resetCreateForm} className="text-xs text-blue-600 hover:underline flex gap-1 items-center"><RotateCcw size={12} /> Cancel Edit</button>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Employee ID</label>
                                            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                                value={createForm.employee_id} onChange={e => setCreateForm({ ...createForm, employee_id: e.target.value })} placeholder="EMP001" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                                            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                                value={createForm.department} onChange={e => setCreateForm({ ...createForm, department: e.target.value })} placeholder="CSE" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                                        <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                            value={createForm.full_name} onChange={e => setCreateForm({ ...createForm, full_name: e.target.value })} placeholder="Dr. John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                                        <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                            value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} placeholder="john@example.com" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
                                            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                                value={createForm.username} onChange={e => setCreateForm({ ...createForm, username: e.target.value })} placeholder="johndoe" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password {editingFacultyId && '(Leave blank to prevent change)'}</label>
                                            <input required={!editingFacultyId} type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                                value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50">
                                        {loading ? 'Processing...' : (editingFacultyId ? 'Update Faculty Account' : 'Create Faculty Account')}
                                    </button>
                                </form>
                            )}

                            {activeTab === 'assign' && (
                                <form onSubmit={handleAssignOrUpdate} className="max-w-lg space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg text-slate-700">{editingAssignmentId ? 'Update Assignment' : 'Assign New Class'}</h3>
                                        {editingAssignmentId && <button type="button" onClick={resetAssignForm} className="text-xs text-blue-600 hover:underline flex gap-1 items-center"><RotateCcw size={12} /> Cancel Edit</button>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Faculty</label>
                                        <select required disabled={!!editingAssignmentId} className={`w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 bg-white ${editingAssignmentId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            value={assignForm.faculty_id} onChange={e => setAssignForm({ ...assignForm, faculty_id: e.target.value })}>
                                            <option value="">-- Select Faculty --</option>
                                            {facultyList.map(f => (
                                                <option key={f.id} value={f.id}>{f.full_name} ({f.department})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Branch</label>
                                            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={assignForm.branch} onChange={e => setAssignForm({ ...assignForm, branch: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Year</label>
                                            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={assignForm.year} onChange={e => setAssignForm({ ...assignForm, year: e.target.value })} placeholder="3" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={assignForm.section} onChange={e => setAssignForm({ ...assignForm, section: e.target.value })} placeholder="All" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject (Optional)</label>
                                        <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                            value={assignForm.subject} onChange={e => setAssignForm({ ...assignForm, subject: e.target.value })} placeholder="e.g. Data Structures" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Period</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={assignForm.period} onChange={e => setAssignForm({ ...assignForm, period: e.target.value })} placeholder="1st Period" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Room No</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={assignForm.room_no} onChange={e => setAssignForm({ ...assignForm, room_no: e.target.value })} placeholder="Block A-204" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Day</label>
                                            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={assignForm.day_of_week} onChange={e => setAssignForm({ ...assignForm, day_of_week: e.target.value })}>
                                                <option value="">-- Any Day --</option>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Registration Number Range</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-400">Start (e.g. 211FA04001)</label>
                                                <input type="text" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded bg-white"
                                                    value={assignForm.start_reg} onChange={e => setAssignForm({ ...assignForm, start_reg: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-400">End (e.g. 211FA04060)</label>
                                                <input type="text" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded bg-white"
                                                    value={assignForm.end_reg} onChange={e => setAssignForm({ ...assignForm, end_reg: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="text-xs text-slate-400">Excluded IDs (comma separated)</label>
                                            <input type="text" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded bg-white"
                                                value={assignForm.excluded_reg} onChange={e => setAssignForm({ ...assignForm, excluded_reg: e.target.value })} placeholder="211FA04005, 211FA04012" />
                                            <p className="text-[10px] text-slate-400 mt-1">These students will be hidden from the attendance list.</p>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50">
                                        {loading ? 'Processing...' : (editingAssignmentId ? 'Update Assignment' : 'Assign Class')}
                                    </button>
                                </form>
                            )}

                            {activeTab === 'list' && (
                                <div className="space-y-4">
                                    {facultyList.map(f => (
                                        <div key={f.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start group">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-800">{f.full_name}</h4>
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{f.department}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-mono mb-3">ID: {f.employee_id} | @{f.username}</p>

                                                <div className="flex flex-wrap gap-2">
                                                    {f.FacultyAssignments && f.FacultyAssignments.map(a => (
                                                        <div key={a.id} className="flex flex-col gap-1 text-xs bg-blue-50 text-blue-700 p-2 rounded border border-blue-100 group/item min-w-[150px]">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-bold">{a.subject || 'Class'}</span>
                                                                {userRole !== 'view_only' && (
                                                                    <div className="flex gap-0.5 opacity-60 group-hover/item:opacity-100">
                                                                        <button onClick={() => startEditAssignment(a, f.id)} className="p-1 hover:bg-blue-200 rounded" title="Edit Assignment">
                                                                            <Edit2 size={10} />
                                                                        </button>
                                                                        <button onClick={() => handleDeleteAssignment(a.id)} className="p-1 hover:bg-red-200 hover:text-red-600 rounded" title="Delete Assignment">
                                                                            <X size={10} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col gap-0.5 text-[10px] text-blue-600/80">
                                                                <span>{a.branch} {a.year} - {a.section || 'All'}</span>
                                                                {(a.period || a.room_no) && (
                                                                    <span className="font-medium">
                                                                        {a.period && `P: ${a.period}`}
                                                                        {a.period && a.room_no && ' | '}
                                                                        {a.room_no && `Rm: ${a.room_no}`}
                                                                    </span>
                                                                )}
                                                                {a.day_of_week && <span className="italic">{a.day_of_week}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!f.FacultyAssignments || f.FacultyAssignments.length === 0) && (
                                                        <span className="text-xs text-slate-400 italic">No classes assigned</span>
                                                    )}
                                                </div>
                                            </div>

                                            {userRole !== 'view_only' && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => startEditFaculty(f)} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="Edit Faculty">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteFaculty(f.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Delete Faculty">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
