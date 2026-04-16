'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';
import { X, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';

// GOOGLE TEST KEYS
// Client: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
// Server: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

export default function CaptchaModal({ isOpen, onClose, onVerify }) {

    const recaptchaRef = useRef(null);



    const handleCaptchaChange = (token) => {
        if (token) {
            // Add a small delay for better UX
            setTimeout(() => {
                onVerify(token);
            }, 500);
        }
    };

    // Use Real Key from Env
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5 animate-in fade-in zoom-in duration-200"
            >
                {/* Decorative Top Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Header */}
                <div className="bg-white p-6 pb-2 text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
                        <ShieldCheck className="text-indigo-600" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight">Security Check</h3>
                    <p className="text-slate-500 text-sm font-medium mt-2">
                        Please complete the check below to continue.
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 pb-8 flex justify-center bg-white relative z-10 min-h-[120px] flex-col items-center">
                    {!siteKey && (
                        <div className="text-rose-500 text-xs font-bold mb-2">Error: Site Key Missing</div>
                    )}

                    <Turnstile
                        ref={recaptchaRef}
                        siteKey={siteKey}
                        onSuccess={handleCaptchaChange}
                        injectScript={true}
                        options={{
                            theme: 'light',
                            size: 'normal',
                        }}
                    />
                </div>

                {/* Footer (Close) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-50 border border-slate-100 rounded-full p-2 transition-all z-20"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
