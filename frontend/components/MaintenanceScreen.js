import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, ShieldAlert, Cpu, Activity, Server, Zap, Hammer } from 'lucide-react';

const MaintenanceScreen = ({ message, description }) => {
    // Determine if we should show 'Maintenance' or 'Busy' text based on input
    const isMaintenance = message?.toLowerCase().includes('maintenance');
    const title = isMaintenance ? "System Maintenance" : "System Capacity Full";
    const subText = description || (isMaintenance
        ? "We are currently improving our systems. Please check back shortly."
        : "We are currently handling maximum traffic. Your request is queued effectively.");

    // Icon Logic
    const Icon = isMaintenance ? Hammer : Server;

    const [countdown, setCountdown] = useState(30);
    const [logs, setLogs] = useState([]);
    const [isRetrying, setIsRetrying] = useState(false);

    // Auto-decrement countdown
    useEffect(() => {
        if (countdown > 0 && !isRetrying) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            handleRetry();
        }
    }, [countdown, isRetrying]);

    // Simulate "Live Diagnostics" logs
    useEffect(() => {
        const messages = isMaintenance ? [
            "Applying security patches...",
            "Migrating database schema...",
            "Verifying data integrity...",
            "Optimizing frontend assets...",
            "Clearing CDN cache...",
            "Running regression tests...",
            "Finalizing deployment...",
            "System reboot scheduled..."
        ] : [
            "Analyzing traffic patterns...",
            "Optimizing database connection pool...",
            "Scaling worker nodes...",
            "Clearing cache fragments...",
            "Verifying request integrity...",
            "Rebalancing load...",
            "Syncing session states...",
            "Allocating reserve bandwidth..."
        ];

        let msgIndex = 0;
        const interval = setInterval(() => {
            const msg = messages[msgIndex % messages.length];
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLogs(prev => [...prev.slice(-4), `[${timestamp}] ${msg}`]); // Keep last 5
            msgIndex++;
        }, 2000);

        return () => clearInterval(interval);
    }, [isMaintenance]);

    const handleRetry = () => {
        setIsRetrying(true);
        setLogs(prev => [...prev, ">>> INITIATING STATUS CHECK..."]);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* --- Dynamic Background --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(100,50,0,0.1),transparent_70%)]"></div>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-500/20 to-transparent"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 max-w-2xl w-full"
            >
                {/* Main Card */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">

                    {/* Top Warning Stripe */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isMaintenance ? 'from-amber-600 via-yellow-500 to-amber-600' : 'from-red-600 via-orange-500 to-red-600'}`}></div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* Left Column: Icon & Count */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className={`w-20 h-20 ${isMaintenance ? 'bg-amber-900/20 border-amber-500/30' : 'bg-red-900/20 border-red-500/30'} border rounded-2xl flex items-center justify-center mb-6 relative`}>
                                <div className={`absolute inset-0 ${isMaintenance ? 'bg-amber-500/10' : 'bg-red-500/10'} blur-xl rounded-full animate-pulse`}></div>
                                <Icon className={`w-10 h-10 ${isMaintenance ? 'text-amber-500' : 'text-red-500'}`} />
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-mono font-bold text-white tabular-nums tracking-tighter">
                                    {countdown}<span className="text-sm text-gray-500 ml-1">s</span>
                                </div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Auto Retry</p>
                            </div>
                        </div>

                        {/* Right Column: Content */}
                        <div className="flex-grow w-full">
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                                {title}
                            </h1>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                {subText}
                            </p>

                            {/* Diagnostics Terminal */}
                            <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-xs text-green-400 mb-8 h-32 overflow-hidden flex flex-col justify-end relative">
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <div className={`w-2 h-2 rounded-full ${isMaintenance ? 'bg-amber-500' : 'bg-red-500'} animate-ping`}></div>
                                    <div className={`w-2 h-2 rounded-full ${isMaintenance ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                </div>
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="truncate"
                                    >
                                        <span className="opacity-50 mr-2">{'>'}</span>{log}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleRetry}
                                    disabled={isRetrying}
                                    className="flex-1 bg-white text-black font-bold py-3.5 px-6 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                                    {isRetrying ? 'Checking...' : 'Check Status Now'}
                                </button>

                                <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-gray-400">
                                    <Activity className="w-4 h-4 text-green-500" />
                                    <span>Monitoring</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Footer Info */}
                <div className="mt-8 flex justify-between items-center text-xs text-gray-600 px-4">
                    <div>Ref ID: <span className="font-mono text-gray-500">SYS-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></div>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 ${isMaintenance ? 'bg-yellow-500' : 'bg-orange-500'} rounded-full`}></div>
                        {isMaintenance ? 'Scheduled' : 'High Load'}
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default MaintenanceScreen;
