"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '@/utils/config';
import {
    Server,
    Database,
    Globe,
    Activity,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    Shield,
    Zap,
    Layout,
    Terminal,
    Cpu,
    TrendingUp,
    Users
} from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        operational: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
        degraded: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        down: "bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
        checking: "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse"
    };

    const icons = {
        operational: <CheckCircle className="w-3 h-3" />,
        degraded: <AlertTriangle className="w-3 h-3" />,
        down: <XCircle className="w-3 h-3" />,
        checking: <RefreshCw className="w-3 h-3 animate-spin" />
    };

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${styles[status] || styles.checking}`}>
            {icons[status] || icons.checking}
            {status}
        </div>
    );
};

const Sparkline = ({ data, color = "stroke-emerald-500" }) => {
    if (!data || data.length < 2) return null;
    const height = 40;
    const width = 120;
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height; // Invert Y
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                strokeWidth="2"
                className={`${color} transition-all duration-300`}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const ServiceCard = ({ title, status, message, icon: Icon, latency, type, detail, sparklineData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group overflow-hidden"
        >
            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative p-5 rounded-xl border border-white/10 bg-[#0F0F12] hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                            {Icon && <Icon className="w-5 h-5 text-gray-300" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-200">{title}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{type}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    {/* Latency & Sparkline Row */}
                    {(latency > 0 || sparklineData) && (
                        <div className="flex justify-between items-end h-10 mb-2">
                            {sparklineData && (
                                <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Sparkline data={sparklineData} color={latency > 200 ? 'stroke-amber-500' : 'stroke-emerald-500'} />
                                </div>
                            )}
                            {latency > 0 && (
                                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded-md ml-auto">
                                    <Zap className="w-3 h-3 text-yellow-500" />
                                    {latency}ms
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <StatusBadge status={status} />
                    </div>

                    <div className="pt-3 border-t border-white/5">
                        <p className="text-xs text-gray-400 leading-relaxed font-mono">
                            <span className="text-gray-600 mr-2">$</span>
                            {message || 'Waiting for status...'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const LogTerminal = ({ logs }) => {
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="rounded-xl border border-white/10 bg-[#0A0A0C] font-mono text-xs overflow-hidden flex flex-col h-64">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-gray-400 font-semibold flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-green-500" />
                    Live System Logs
                </span>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-gray-300 scrollbar-thin scrollbar-thumb-white/10">
                {logs.length === 0 ? (
                    <span className="text-gray-600 italic">Listening for events...</span>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="break-all border-l-2 border-transparent hover:border-white/10 pl-2 -ml-2 py-0.5">
                            <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            {log}
                        </div>
                    ))
                )}
                <div ref={endRef} />
            </div>
        </div>
    );
};

const RouteStrip = ({ route, status, latency }) => {
    const getStatusColor = (s) => {
        if (s === 'operational') return 'bg-emerald-500';
        if (s === 'down') return 'bg-rose-500';
        return 'bg-blue-500';
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)} shadow-[0_0_8px_currentColor]`} />
                <span className="font-mono text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{route}</span>
            </div>
            <div className="flex items-center gap-4">
                {latency > 0 && <span className="text-xs font-mono text-gray-600 group-hover:text-gray-500">{latency}ms</span>}
                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${status === 'operational'
                    ? 'border-emerald-500/30 text-emerald-500/80'
                    : status === 'down'
                        ? 'border-rose-500/30 text-rose-500/80'
                        : 'border-blue-500/30 text-blue-500/80'
                    }`}>
                    {status === 'operational' ? 'UP' : status === 'down' ? 'ERR' : 'CHK'}
                </div>
            </div>
        </div>
    );
};

export default function SystemHealth() {
    const [lastUpdated, setLastUpdated] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Developer Mode State
    const [showDevMode, setShowDevMode] = useState(false);
    const [serverLogs, setServerLogs] = useState([]);

    // Independent uptime state
    const [serverUptime, setServerUptime] = useState(0);

    // Latency History for Sparkline
    const [latencyHistory, setLatencyHistory] = useState([]);
    const [trafficHistory, setTrafficHistory] = useState([]);

    const [healthData, setHealthData] = useState({
        api: { status: 'checking', message: 'Initializing connection...', latency: 0 },
        database: { status: 'checking', message: 'Verifying connectivity...', latency: 0 },
        microsoft: { status: 'checking', message: 'Verifying auth config...', latency: 0 },
        traffic: { active: 0 },
        counts: { students: 0, faculty: 0, admins: 0 },
        system: null // For expanded metrics
    });

    const [routes, setRoutes] = useState({
        public: [
            { path: '/', status: 'checking', latency: 0 },
            { path: '/guidelines', status: 'checking', latency: 0 },
            { path: '/privacy', status: 'checking', latency: 0 },
            { path: '/terms', status: 'checking', latency: 0 },
        ],
        student: [
            { path: '/student', status: 'checking', latency: 0 },
            { path: '/student/login', status: 'checking', latency: 0 },
            { path: '/student/profile', status: 'checking', latency: 0 },
            { path: '/student/complete-profile', status: 'checking', latency: 0 },
        ],
        admin: [
            { path: '/admin', status: 'checking', latency: 0 },
            { path: '/admin/login', status: 'checking', latency: 0 },
            { path: '/live', status: 'checking', latency: 0 },
            { path: '/malpractice', status: 'checking', latency: 0 },
        ]
    });
    const [isAuthorized, setIsAuthorized] = useState(false); // Auth State

    useEffect(() => {
        const role = localStorage.getItem('role');
        const perms = JSON.parse(localStorage.getItem('permissions') || '[]');

        if (role === 'main_admin' || perms.includes('view_health')) {
            setIsAuthorized(true);
        } else {
            // Redirect / Block
            window.location.href = '/admin?error=access_denied';
        }
    }, []);

    // Uptime ticker
    useEffect(() => {
        const timer = setInterval(() => {
            setServerUptime(prev => prev > 0 ? prev + 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // REMOVED EARLY RETURN HERE to fix Hook Order

    // Poll Logs when Dev Mode is active
    useEffect(() => {
        if (!showDevMode) return;
        const fetchLogs = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/logs`);
                const data = await res.json();
                if (data.logs) setServerLogs(data.logs);
            } catch (e) { console.error("Log fetch error", e); }
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, [showDevMode]);

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}h ${m}m ${s}s`;
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const checkEndpoint = async (url) => {
        const start = performance.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal,
                cache: 'no-store'
            });
            clearTimeout(timeoutId);

            const end = performance.now();
            return {
                status: res.ok ? 'operational' : 'down',
                latency: Math.round(end - start),
                code: res.status
            };
        } catch (err) {
            return { status: 'down', latency: 0, error: err.message };
        }
    };

    // Real-time Latency Ticker & Sparkline Data
    useEffect(() => {
        const checkLatency = async () => {
            const start = performance.now();
            try {
                const res = await fetch(`${API_BASE_URL}/api/health`, {
                    method: 'GET', // Changed from HEAD to GET to fetch traffic data
                    cache: 'no-store'
                });
                const end = performance.now();
                const latency = Math.round(end - start);

                let activeTraffic = 0;
                if (res.ok) {
                    const data = await res.json();
                    activeTraffic = data.traffic?.active || 0;
                }

                // Update Latency History
                setLatencyHistory(prev => {
                    const next = [...prev, latency];
                    if (next.length > 30) next.shift(); // Keep last 30 points
                    return next;
                });

                // Update Traffic History
                setTrafficHistory(prev => {
                    const next = [...prev, activeTraffic];
                    if (next.length > 30) next.shift();
                    return next;
                });

                setHealthData(prev => ({
                    ...prev,
                    api: {
                        ...prev.api,
                        latency: latency,
                        status: res.ok ? 'operational' : 'down'
                    },
                    traffic: { ...prev.traffic, active: activeTraffic }
                }));
            } catch (err) {
                // Fail silent
            }
        };

        checkLatency();
        const interval = setInterval(checkLatency, 2000); // 2s polling
        return () => clearInterval(interval);
    }, []);

    const runDiagnostics = async () => {
        setRefreshing(true);

        // 1. Check Backend API
        const apiStart = performance.now();
        try {
            const res = await fetch(`${API_BASE_URL}/api/health`);
            const data = await res.json();
            const apiEnd = performance.now();

            // Sync uptime from server
            if (data.uptime) setServerUptime(Math.floor(data.uptime));

            setHealthData(prev => ({
                ...prev,
                api: {
                    ...prev.api, // Keep latency/status from high-freq poll
                    message: res.ok ? `Online` : data.message,
                },
                database: {
                    status: data.database?.status === 'connected' ? 'operational' : 'down',
                    message: data.database?.message || 'Unknown Status',
                    latency: 0
                },
                microsoft: {
                    status: data.microsoft?.status === 'configured' ? 'operational' : 'degraded',
                    message: data.microsoft?.message || 'Check Env Vars',
                    latency: 0
                },
                traffic: data.traffic || { active: 0 },
                counts: data.counts || { students: 0, faculty: 0, admins: 0 },
                system: data.system // Store system metrics
            }));
        } catch (err) {
            setHealthData(prev => ({
                ...prev,
                api: { ...prev.api, status: 'down', message: 'Connection Failed' },
                database: { status: 'down', message: 'Unreachable', latency: 0 },
                system: null
            }));
        }

        // 2. Check Routes Parallel
        const checkCategory = async (category, items) => {
            const results = await Promise.all(items.map(async (route) => {
                const result = await checkEndpoint(route.path);
                return { ...route, ...result };
            }));
            return results;
        };

        const [pub, stu, adm] = await Promise.all([
            checkCategory('public', routes.public),
            checkCategory('student', routes.student),
            checkCategory('admin', routes.admin),
        ]);

        setRoutes({
            public: pub,
            student: stu,
            admin: adm
        });

        setLastUpdated(new Date());
        setRefreshing(false);
    };

    useEffect(() => {
        runDiagnostics();
        const interval = setInterval(runDiagnostics, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!isAuthorized) return <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white"><div className="flex flex-col items-center gap-4"><Shield className="w-12 h-12 text-gray-700" /><p className="text-gray-500 font-mono text-sm">Verifying Access Clearance...</p></div></div>;

    return (
        <div className="min-h-screen bg-[#050507] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 tracking-tight mb-2">
                            System Status
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Operational Intelligence Dashboard
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 mr-4">
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Dev Mode</span>
                            <button
                                onClick={() => setShowDevMode(!showDevMode)}
                                className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${showDevMode ? 'bg-purple-600' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${showDevMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="text-right hidden md:block">
                            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Last Sync</p>
                            <p className="text-sm font-mono text-gray-400">
                                {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                            </p>
                        </div>
                        <button
                            onClick={runDiagnostics}
                            disabled={refreshing}
                            className={`p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-white ${refreshing ? 'animate-spin opacity-50' : 'hover:scale-105 active:scale-95'}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Critical Infrastructure */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-gray-400 mb-4">
                        <Cpu className="w-5 h-5" />
                        <h2 className="text-sm font-semibold uppercase tracking-widest">Core Infrastructure</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        <ServiceCard
                            title="API Gateway"
                            type="Backend"
                            icon={Server}
                            {...healthData.api}
                            message={`Uptime: ${formatUptime(serverUptime)}`}
                            sparklineData={latencyHistory} // Pass history for graph
                        />
                        <ServiceCard
                            title="Primary DB"
                            type="MySQL Storage"
                            icon={Database}
                            {...healthData.database}
                        />
                        <ServiceCard
                            title="Microsoft Auth"
                            type="OAuth Service"
                            icon={Shield}
                            {...healthData.microsoft}
                        />
                        <ServiceCard
                            title="Client App"
                            type="Next.js Frontend"
                            icon={Globe}
                            status={routes.public[0].status === 'operational' ? 'operational' : 'degraded'} // Inherit from landing page
                            message="Serving static & dynamic assets"
                            latency={routes.public[0].latency}
                        />
                        <ServiceCard
                            title="Auth Security"
                            type="JWT Layer"
                            icon={Shield}
                            status="operational" // Inferred
                            message="Token Validation Active"
                        />
                    </div>
                </div>

                {/* Live Activity & Users */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-gray-400 mb-4">
                        <Activity className="w-5 h-5" />
                        <h2 className="text-sm font-semibold uppercase tracking-widest">Live Activity & User Base</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ServiceCard
                            title="Active Traffic"
                            type="Real-time Load"
                            icon={Activity}
                            status={healthData.traffic.active > 100 ? 'degraded' : 'operational'}
                            message={`${healthData.traffic.active} Active Request${healthData.traffic.active !== 1 ? 's' : ''}`}
                            latency={0}
                            sparklineData={trafficHistory}
                        />
                        <ServiceCard
                            title="Students"
                            type="Total Registered"
                            icon={Users}
                            status="operational"
                            message={`${healthData.counts.students} Students`}
                            latency={0}
                        />
                        <ServiceCard
                            title="Faculty"
                            type="Staff Members"
                            icon={Users}
                            status="operational"
                            message={`${healthData.counts.faculty} Faculty`}
                            latency={0}
                        />
                        <ServiceCard
                            title="Admins"
                            type="System Admins"
                            icon={Shield}
                            status="operational"
                            message={`${healthData.counts.admins} Admins`}
                            latency={0}
                        />
                    </div>
                </div>

                {/* Developer Mode Section */}
                <AnimatePresence>
                    {showDevMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 overflow-hidden"
                        >
                            <div className="flex items-center gap-3 text-purple-400 mb-4 pt-6 border-t border-white/5">
                                <Terminal className="w-5 h-5" />
                                <h2 className="text-sm font-semibold uppercase tracking-widest">System Internals</h2>
                            </div>

                            {healthData.system && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Environment Card */}
                                    <div className="p-5 rounded-xl border border-white/10 bg-[#0F0F12] relative overflow-hidden">
                                        <h3 className="text-sm font-bold text-gray-300 mb-4">Environment</h3>
                                        <div className="space-y-3 font-mono text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Node Version</span>
                                                <span className="text-emerald-400">{healthData.system.process?.nodeVersion}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Platform</span>
                                                <span className="text-blue-400 capitalize">{healthData.system.os?.platform} ({healthData.system.os?.arch})</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">PID</span>
                                                <span className="text-gray-300">{healthData.system.process?.pid}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Memory Card */}
                                    <div className="p-5 rounded-xl border border-white/10 bg-[#0F0F12] relative overflow-hidden">
                                        <h3 className="text-sm font-bold text-gray-300 mb-4">Memory Usage</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-500">RSS</span>
                                                    <span className="text-gray-300 font-mono">{formatBytes(healthData.system.memory?.rss)}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500/50 w-1/2 rounded-full" /> {/* Placeholder width */}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-500">Heap Used</span>
                                                    <span className="text-gray-300 font-mono">{formatBytes(healthData.system.memory?.heapUsed)}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500/50 rounded-full transition-all duration-500"
                                                        style={{ width: `${(healthData.system.memory?.heapUsed / healthData.system.memory?.heapTotal) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Load Card */}
                                    <div className="p-5 rounded-xl border border-white/10 bg-[#0F0F12] relative overflow-hidden">
                                        <h3 className="text-sm font-bold text-gray-300 mb-4">Host Specs</h3>
                                        <div className="space-y-3 font-mono text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">CPU Model</span>
                                                <span className="text-gray-300 truncate max-w-[150px]" title={healthData.system.os?.model}>{healthData.system.os?.model}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Cores</span>
                                                <span className="text-amber-400">{healthData.system.os?.cpus} Threads</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">System Memory</span>
                                                <span className="text-gray-300">{formatBytes(healthData.system.os?.totalMem)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Console Logs */}
                            <LogTerminal logs={serverLogs} />

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Route Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Public Routes */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Public Access</h3>
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {routes.public.map(r => <RouteStrip key={r.path} route={r.path} status={r.status} latency={r.latency} />)}
                        </div>
                    </div>

                    {/* Student Portal */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-500/70">Student Portal</h3>
                            <Activity className="w-4 h-4 text-blue-500/50" />
                        </div>
                        <div className="space-y-2">
                            {routes.student.map(r => <RouteStrip key={r.path} route={r.path} status={r.status} latency={r.latency} />)}
                        </div>
                    </div>

                    {/* Admin Console */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-purple-500/70">Admin Console</h3>
                            <Layout className="w-4 h-4 text-purple-500/50" />
                        </div>
                        <div className="space-y-2">
                            {routes.admin.map(r => <RouteStrip key={r.path} route={r.path} status={r.status} latency={r.latency} />)}
                        </div>
                    </div>

                </div>

                {/* Footer Info */}
                <div className="border-t border-white/5 pt-8 text-center md:text-left">
                    <p className="text-xs text-gray-600 font-mono">
                        SYSTEM_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} • REGION: LOCAL_DEV • ENV: DEVELOPMENT
                    </p>
                </div>

            </div>
        </div>
    );
}
