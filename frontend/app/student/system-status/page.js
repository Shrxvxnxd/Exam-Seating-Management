"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Activity,
    Server,
    Database,
    ShieldCheck,
    RefreshCw,
    Clock,
    Calendar,
    Zap
} from 'lucide-react';
import { API_BASE_URL } from '../../../utils/config';

const StatusCard = ({ title, status, description, icon: Icon }) => {
    const isOperational = status === 'operational';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${isOperational
                ? 'bg-white/5 border-white/10'
                : 'bg-rose-500/10 border-rose-500/20'
                } backdrop-blur-xl flex items-center gap-5`}
        >
            <div className={`p-3 rounded-full ${isOperational ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                {Icon && <Icon className="w-6 h-6" />}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isOperational ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                        {isOperational ? (
                            <>
                                <CheckCircle className="w-3 h-3" />
                                Operational
                            </>
                        ) : (
                            <>
                                <XCircle className="w-3 h-3" />
                                Outage
                            </>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    {description || (isOperational ? 'All systems functional' : 'Service is currently unavailable')}
                </p>
            </div>
        </motion.div>
    );
};

const MaintenanceWidget = ({ data }) => {
    if (!data) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-2xl border border-white/5 bg-[#0F0F12]/50 flex items-center justify-center h-40"
        >
            <p className="text-sm text-gray-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500/50" />
                No maintenance scheduled
            </p>
        </motion.div>
    );

    const date = new Date(data.scheduled_start);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const startTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(data.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl border border-white/10 bg-[#0F0F12] relative overflow-hidden"
        >
            <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Calendar className="w-5 h-5" />
                <h3 className="font-semibold tracking-wide text-sm uppercase">Scheduled Maintenance</h3>
            </div>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="bg-white/5 rounded-lg p-3 text-center min-w-[70px]">
                        <div className="text-xs text-gray-500 uppercase">{month}</div>
                        <div className="text-xl font-bold text-gray-200">{day}</div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-200">{data.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {startTime} - {endTime}
                        </p>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                            {data.description}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const RecentActivityWidget = ({ activities }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-white/10 bg-[#0F0F12]"
    >
        <div className="flex items-center gap-3 mb-4 text-purple-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-semibold tracking-wide text-sm uppercase">Recent Activity</h3>
        </div>

        <div className="space-y-6 relative pl-2">
            {/* Vertical Line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/10" />

            {activities.length === 0 ? (
                <p className="text-sm text-gray-500 italic pl-6">No recent logs.</p>
            ) : activities.map((item, i) => (
                <div key={i} className="relative flex gap-4">
                    <div className={`w-4 h-4 rounded-full border-2 border-[#0F0F12] z-10 flex-shrink-0 ${item.type === 'incident' ? 'bg-rose-500' :
                        item.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
                        }`} />
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                        <h4 className="text-sm font-medium text-gray-200">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

export default function StudentSystemStatus() {
    const [status, setStatus] = useState({
        portal: 'operational',
        auth: 'operational',
        database: 'operational'
    });
    const [lastChecked, setLastChecked] = useState(null);
    const [loading, setLoading] = useState(true);

    const [maintenance, setMaintenance] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);

    const checkSystem = async () => {
        setLoading(true);
        try {
            // Check Backend & Database
            const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'HEAD' }); // Lightweight check
            const isBackendUp = res.ok;

            setStatus({
                portal: isBackendUp ? 'operational' : 'down',
                auth: isBackendUp ? 'operational' : 'down',
                database: isBackendUp ? 'operational' : 'down'
            });

            // Fetch dynamic system events
            const eventRes = await fetch(`${API_BASE_URL}/api/system-events`);
            if (eventRes.ok) {
                const eventData = await eventRes.json();
                setMaintenance(eventData.maintenance);
                setRecentActivity(eventData.recentActivity || []);
            }

        } catch (error) {
            setStatus({
                portal: 'down',
                auth: 'down',
                database: 'down'
            });
        } finally {
            setLastChecked(new Date());
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSystem();
        const interval = setInterval(checkSystem, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const allSystemsGo = Object.values(status).every(s => s === 'operational');

    return (
        <div className="min-h-screen bg-[#050507] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30 flex justify-center">
            <div className="max-w-6xl w-full space-y-12">

                {/* Global Status Header */}
                <div className="text-center space-y-6 pt-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative inline-block"
                    >
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${allSystemsGo ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div
                            className={`relative inline-flex items-center gap-3 px-8 py-4 rounded-full border ${allSystemsGo ? 'bg-[#050507] border-emerald-500/30 text-emerald-400' : 'bg-[#050507] border-rose-500/30 text-rose-400'
                                }`}
                        >
                            <div className="relative">
                                {allSystemsGo && <div className="absolute inset-0 bg-emerald-500/50 rounded-full animate-ping" />}
                                {allSystemsGo ? <Activity className="w-5 h-5 relative z-10" /> : <AlertTriangle className="w-5 h-5 relative z-10" />}
                            </div>
                            <span className="font-semibold tracking-wide text-lg">
                                {allSystemsGo ? 'All Systems Operational' : 'System Degraded'}
                            </span>
                        </div>
                    </motion.div>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 tracking-tight mb-3">
                            Service Status
                        </h1>
                        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                            Live status updates for the Examination Portal services. <br />
                            Check here for maintenance schedules and incident reports.
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Status Cards (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <StatusCard
                            title="Exam Seating Portal"
                            status={status.portal}
                            icon={Server}
                            description="Access to seating arrangements and hall tickets."
                        />
                        <StatusCard
                            title="Student Authentication"
                            status={status.auth}
                            icon={ShieldCheck}
                            description="Login, Microsoft SSO, and Profile services."
                        />
                        <StatusCard
                            title="Data Reliability"
                            status={status.database}
                            icon={Database}
                            description="Real-time availability of examination records."
                        />
                    </div>

                    {/* Right Column: Info Widgets (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <MaintenanceWidget data={maintenance} />
                        <RecentActivityWidget activities={recentActivity} />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-center items-center gap-2 text-xs text-gray-600 font-mono mt-12 pb-8">
                    <Clock className="w-3 h-3" />
                    <span>Last verified: {lastChecked ? lastChecked.toLocaleTimeString() : 'Checking...'}</span>
                    {loading && <RefreshCw className="w-3 h-3 animate-spin ml-2" />}
                </div>

            </div>
        </div>
    );
}
