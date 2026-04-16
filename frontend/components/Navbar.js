'use client';
import Link from 'next/link';
import { GraduationCap, LayoutDashboard, Search, Radio, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on path change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        setIsSigningOut(true);
        // Small delay to show the loading state (UX)
        await new Promise(resolve => setTimeout(resolve, 800));
        logout();
        setShowProfileMenu(false);
        setIsSigningOut(false);
    };

    const isActive = (path) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all">
            <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 group relative z-50">
                    <div className="bg-slate-900 p-2 md:p-2.5 rounded-xl text-white group-hover:scale-105 transition-transform shadow-lg shadow-slate-200">
                        <GraduationCap size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm md:text-xl font-black text-slate-900 uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">Student Portal</span>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5 md:mt-1">Smart Management</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <NavLink href="/live" active={isActive('/live')} icon={<Radio size={18} className={isActive('/live') ? 'text-white' : 'text-emerald-500 animate-pulse'} />}>Live</NavLink>
                    <NavLink href="/admin" active={isActive('/admin')} icon={<LayoutDashboard size={18} />}>Admin</NavLink>
                    <NavLink href="/student" active={isActive('/student')} icon={<Search size={18} />}>Student</NavLink>

                    {user ? (
                        <div className="relative ml-2">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl border border-slate-200 transition-all"
                            >
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase">
                                    {user.username?.[0] || 'U'}
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showProfileMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 origin-top-right"
                                        >
                                            <div className="p-4 border-b border-slate-50 mb-2">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                                <p className="text-sm font-black text-slate-900 truncate">{user.full_name || user.username}</p>
                                                <p className="text-[10px] font-medium text-slate-500 truncate">{user.email}</p>
                                            </div>

                                            <Link
                                                href={user.role === 'admin' ? '/admin/profile' : '/student/profile'}
                                                onClick={() => setShowProfileMenu(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-emerald-600 transition-all group"
                                            >
                                                <User size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                                <span className="font-bold text-sm">View Profile</span>
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                disabled={isSigningOut}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSigningOut ? (
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                                                    </div>
                                                ) : (
                                                    <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                                                )}
                                                <span className="font-bold text-sm">{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/student/login" className="ml-2 px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-slate-200/50">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden relative z-50 p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-white shadow-2xl z-50 md:hidden flex flex-col pt-24 pb-6 px-6 border-l border-slate-100"
                        >
                            <div className="flex flex-col gap-2">
                                <MobileNavLink href="/live" active={isActive('/live')} icon={<Radio size={20} className={isActive('/live') ? 'text-emerald-500 animate-pulse' : ''} />}>Live Sessions</MobileNavLink>
                                <MobileNavLink href="/admin" active={isActive('/admin')} icon={<LayoutDashboard size={20} />}>Admin Portal</MobileNavLink>
                                <MobileNavLink href="/student" active={isActive('/student')} icon={<Search size={20} />}>Student Search</MobileNavLink>
                            </div>

                            <div className="mt-auto border-t border-slate-100 pt-6">
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold uppercase">
                                                {user.username?.[0] || 'U'}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-black text-slate-900 truncate">{user.full_name || user.username}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link href={user.role === 'admin' ? '/admin/profile' : '/student/profile'} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm">
                                            <User size={18} /> View Profile
                                        </Link>
                                        <button onClick={handleLogout} disabled={isSigningOut} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm w-full">
                                            <LogOut size={18} /> {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                                        </button>
                                    </div>
                                ) : (
                                    <Link href="/student/login" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-wider rounded-xl">
                                        Login to Portal
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, children, active, icon }) {
    return (
        <Link href={href} className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all duration-200 uppercase tracking-wide border
            ${active
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-emerald-600'}
        `}>
            <span>{icon}</span>
            <span>{children}</span>
        </Link>
    );
}

function MobileNavLink({ href, children, active, icon }) {
    return (
        <Link href={href} className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all duration-200 uppercase tracking-wide
            ${active
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                : 'text-slate-600 hover:bg-slate-50'}
        `}>
            <span className={`${active ? 'text-emerald-400' : 'text-slate-400'}`}>{icon}</span>
            <span>{children}</span>
        </Link>
    );
}
