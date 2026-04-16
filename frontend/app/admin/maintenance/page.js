"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tags,
    Trash2,
    Calendar,
    Activity,
    AlertTriangle,
    ShieldAlert,
    Clock,
    CheckCircle,
    Shield,
    Plus,
    X
} from 'lucide-react';
import { API_BASE_URL } from '../../../utils/config';

export default function MaintenancePanel() {
    const [events, setEvents] = useState({ maintenance: null, recentActivity: [] });
    const [isAuthorized, setIsAuthorized] = useState(false); // Auth State

    useEffect(() => {
        const role = localStorage.getItem('role');
        const perms = JSON.parse(localStorage.getItem('permissions') || '[]');

        if (role === 'main_admin' || perms.includes('manage_maintenance')) {
            setIsAuthorized(true);
        } else {
            // Redirect / Block
            window.location.href = '/admin?error=access_denied';
        }
    }, []);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        type: 'maintenance',
        title: '',
        description: '',
        status: 'Scheduled',
        scheduled_start: '',
        scheduled_end: ''
    });

    // Emergency Toggle State (In reality, this would just be creating a specific event)
    // Emergency Toggle State (In reality, this would just be creating a specific event)
    const [emergencyMode, setEmergencyMode] = useState(false);

    useEffect(() => {
        if (isAuthorized) fetchEvents();
    }, [isAuthorized]);

    if (!isAuthorized) return <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white"><div className="flex flex-col items-center gap-4"><Shield className="w-12 h-12 text-gray-700" /><p className="text-gray-500 font-mono text-sm">Verifying Access Clearance...</p></div></div>;

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/system-events`);
            if (res.ok) {
                const data = await res.json();
                setEvents({
                    maintenance: data.maintenance,
                    recentActivity: data.recentActivity || []
                });
                // Check if we are in emergency mode (active maintenance > now)
                if (data.maintenance && data.maintenance.status === 'In Progress') {
                    setEmergencyMode(true);
                } else {
                    setEmergencyMode(false);
                }
            } else {
                console.error("Fetch failed", res.status);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will remove the event immediately.')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/system-events/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Delete failed");
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert("Failed to delete event. Check console.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (payload.type === 'maintenance') {
                payload.scheduled_start = new Date(payload.scheduled_start);
                payload.scheduled_end = new Date(payload.scheduled_end);
            } else {
                payload.createdAt = new Date();
                // Create reasonable default timestamps for non-maintenance types
                payload.scheduled_start = null;
                payload.scheduled_end = null;
            }

            const res = await fetch(`${API_BASE_URL}/api/system-events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Create failed");

            setIsAdding(false);
            setFormData({ type: 'maintenance', title: '', description: '', status: 'Scheduled', scheduled_start: '', scheduled_end: '' });
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('Failed to create event. See console for details.');
        }
    };

    const triggerEmergency = async () => {
        if (!confirm('DANGER: This will immediately block ALL student access. Are you sure?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/system-events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'maintenance',
                    title: 'EMERGENCY MAINTENANCE',
                    description: 'The system has been locked down by an administrator for emergency protocols.',
                    status: 'In Progress',
                    scheduled_start: new Date(),
                    scheduled_end: new Date(new Date().getTime() + 3600000) // +1 Hour default
                })
            });

            if (!res.ok) throw new Error("Emergency trigger failed");

            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('Failed to trigger emergency mode. Check backend logs.');
        }
    };

    return (
        <div className="min-h-screen bg-[#050507] text-white p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-100 flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-purple-500" />
                            Maintenance Control
                        </h1>
                        <p className="text-gray-500 mt-2">Manage system availability and communicate incidents.</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold"
                    >
                        {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? 'Cancel' : 'New Event'}
                    </button>
                </div>

                {/* Emergency Control */}
                <div className="p-6 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${emergencyMode ? 'bg-rose-500 animate-pulse' : 'bg-rose-500/20'}`}>
                            <AlertTriangle className={`w-6 h-6 ${emergencyMode ? 'text-white' : 'text-rose-500'}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-rose-100">Emergency Shutdown</h3>
                            <p className="text-rose-300/60 text-sm">Instantly block student access and display maintenance message.</p>
                        </div>
                    </div>
                    <button
                        onClick={emergencyMode ? () => handleDelete(events.maintenance?.id) : triggerEmergency}
                        className={`px-6 py-2 rounded-lg font-bold text-sm tracking-wider uppercase transition-all ${emergencyMode
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20'
                            }`}
                    >
                        {emergencyMode ? 'Restore Access' : 'ACTIVATE LOCKDOWN'}
                    </button>
                </div>

                {/* Create Form */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[#0A0A0C] border border-white/10 rounded-xl p-6 overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 mb-1">Type</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="maintenance">Maintenance</option>
                                            <option value="incident">Incident Report</option>
                                            <option value="info">General Info</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 mb-1">Status Tag</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                                            placeholder="Detailed Status (e.g. Scheduled, Resolved)"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-gray-500 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-gray-500 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {formData.type === 'maintenance' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase text-gray-500 mb-1">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500 theme-dark-calendar"
                                                value={formData.scheduled_start}
                                                onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase text-gray-500 mb-1">End Time</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500 theme-dark-calendar"
                                                value={formData.scheduled_end}
                                                onChange={(e) => setFormData({ ...formData, scheduled_end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-2">
                                    <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm">
                                        Publish Event
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Maintenance */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-300 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Scheduled / Active Maintenance
                    </h2>

                    {!events.maintenance ? (
                        <div className="p-8 rounded-xl border border-white/5 bg-white/[0.02] text-center text-gray-500 italic">
                            No pending maintenance windows.
                        </div>
                    ) : (
                        <div className="p-6 rounded-xl border border-white/10 bg-[#0F0F12] relative group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${events.maintenance.status === 'In Progress'
                                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            }`}>
                                            {events.maintenance.status}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {new Date(events.maintenance.scheduled_start).toLocaleString()}
                                            {' -> '}
                                            {new Date(events.maintenance.scheduled_end).toLocaleString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{events.maintenance.title}</h3>
                                    <p className="text-gray-400">{events.maintenance.description}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(events.maintenance.id)}
                                    className="p-2 hover:bg-rose-500/20 hover:text-rose-500 text-gray-600 rounded-lg transition-colors"
                                    title="Cancel Maintenance"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-300 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        Event History
                    </h2>
                    <div className="space-y-3">
                        {events.recentActivity.map(event => (
                            <div key={event.id} className="p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] flex justify-between items-center group transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${event.type === 'incident' ? 'bg-rose-500' :
                                        event.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                                        }`} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-200">{event.title}</h4>
                                            <span className="text-[10px] uppercase px-1.5 rounded border border-white/10 text-gray-500">{event.status}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">{new Date(event.createdAt).toLocaleString()} • {event.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/20 hover:text-rose-500 text-gray-600 rounded transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
