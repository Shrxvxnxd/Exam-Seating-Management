'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, CheckCircle, Scale, Building2, Gavel, Lock } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-purple-500/30 flex flex-col bg-[#050507] text-white">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                                <Scale size={14} />
                                Legal Documentation
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                Terms & Conditions
                            </h1>
                            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                                Please read these terms carefully before using the Student Portal. By accessing or using the service, you agree to be bound by these terms.
                            </p>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#0A0A0C]/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5 space-y-12"
                    >
                        {/* Section 1 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle size={24} /></div>
                                1. Acceptance of Terms
                            </h2>
                            <div className="pl-0 md:pl-20 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    By accessing and using this Student Portal Smart Management ("Service"), you acknowledge that you have read, understood, and agree to comply with these Terms and Conditions. These terms apply to all students, faculty, and administrators who use the system.
                                </p>
                                <p>
                                    If you do not agree with any part of these terms, you may not use the Service.
                                </p>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 2 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><Shield size={24} /></div>
                                2. User Responsibilities
                            </h2>
                            <div className="pl-0 md:pl-20 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    As a user of this portal, you agree to:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                                        <span>Maintain the confidentiality of your login credentials.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                                        <span>Provide accurate and current information during profile completion.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                                        <span>Not attempt to bypass security measures or access unauthorized areas.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 3 - Authentication */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Lock size={24} /></div>
                                3. Authentication & Security
                            </h2>
                            <div className="pl-0 md:pl-20 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Access to the Student Portal is secured via <strong>Microsoft Single Sign-On (SSO)</strong>. By using this service:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5"></div>
                                        <span>You authorize the University to verify your identity using your institutional Microsoft account.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5"></div>
                                        <span>You acknowledge that account security (passwords, 2FA) is managed by Microsoft, not this portal.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><Building2 size={24} /></div>
                                4. Examination Conduct
                            </h2>
                            <div className="pl-0 md:pl-20 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    The seating arrangements and schedules displayed are official. Students must verify their allocation 24 hours prior to exams. Any discrepancy should be reported immediately.
                                </p>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200/80">
                                    Note: Last-minute changes due to administrative reasons may occur. Always check physical notice boards as a secondary confirmation.
                                </div>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 5 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Gavel size={24} /></div>
                                5. Intellectual Property
                            </h2>
                            <div className="pl-0 md:pl-20 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    All content, features, and functionality of this Student Portal are owned by the University and are protected by international copyright, trademark, and other intellectual property rules.
                                </p>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 6 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"><AlertCircle size={24} /></div>
                                6. Malpractice Policy
                            </h2>
                            <div className="pl-0 md:pl-20 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Any attempt to manipulate the seating system, impersonate other students, or access unauthorized administrative routes will be treated as serious academic misconduct.
                                </p>
                                <p>
                                    Violations will be reported to the Disciplinary Committee and may result in:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-red-500">
                                    <li>Temporary or permanent suspension of portal access.</li>
                                    <li>Cancellation of current examination attempt.</li>
                                    <li>Other academic penalties as per University regulations.</li>
                                </ul>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 7 */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gray-500/10 text-gray-400 border border-gray-500/20"><FileText size={24} /></div>
                                7. Limitation of Liability
                            </h2>
                            <div className="pl-0 md:pl-20 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    The University shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use this service, including but not limited to temporary system downtime during high-traffic periods.
                                </p>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="text-center pt-8">
                            <p className="text-gray-500 text-sm font-medium">
                                Last Updated: <span className="text-gray-300">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </p>
                            <p className="text-gray-500 text-sm mt-3">
                                Questions? <a href="mailto:support@university.edu" className="text-purple-400 hover:text-purple-300 transition-colors">Contact Support</a>
                            </p>
                        </div>

                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
