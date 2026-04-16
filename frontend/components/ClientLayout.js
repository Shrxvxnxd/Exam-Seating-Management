'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../context/AuthContext';
import GlobalAuthLoader from './GlobalAuthLoader';

import CookieConsent from './CookieConsent';

import { useEffect } from 'react';

export default function ClientLayout({ children }) {
    useEffect(() => {
        // Suppress React DevTools suggestion
        const originalInfo = console.info;
        console.info = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
                return;
            }
            originalInfo.apply(console, args);
        };
    }, []);

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <GlobalAuthLoader>
                    {children}
                    <CookieConsent />
                </GlobalAuthLoader>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}
