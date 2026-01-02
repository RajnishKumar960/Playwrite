"use client";

import { useState, useEffect } from 'react';
import { Lock, LogOut, CheckCircle, Loader2, AlertCircle, LinkedinIcon } from 'lucide-react';

// Get backend URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

interface LinkedInAuth {
    logged_in: boolean;
    user?: {
        name: string;
        email: string;
    };
}

export default function SettingsPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [authStatus, setAuthStatus] = useState<LinkedInAuth>({ logged_in: false });
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');

    // Check LinkedIn auth status on mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('linkedin_email');
        if (storedEmail) {
            checkAuthStatus(storedEmail);
        }
    }, []);

    const checkAuthStatus = async (emailToCheck: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/linkedin/status?email=${encodeURIComponent(emailToCheck)}`);
            const data = await res.json();
            setAuthStatus(data);
            if (data.logged_in) {
                setEmail(emailToCheck);
            }
        } catch (err) {
            console.error('Failed to check auth status:', err);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/linkedin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.status === 'otp_required') {
                // Show OTP modal
                setSessionId(data.session_id);
                setShowOTPModal(true);
                setError('');
            } else if (data.status === 'success') {
                // Login successful
                localStorage.setItem('linkedin_email', email);
                setAuthStatus({ logged_in: true, user: data.user });
                setError('');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError(`Connection error. Backend: ${BACKEND_URL}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/linkedin/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    otp_code: otp || undefined
                })
            });

            const data = await res.json();

            if (data.status === 'success') {
                localStorage.setItem('linkedin_email', email);
                setAuthStatus({ logged_in: true, user: data.user });
                setShowOTPModal(false);
                setOtp('');
            } else if (data.status === 'pending') {
                // Still waiting for mobile approval
                setTimeout(handleVerifyOTP, 2000); // Poll every 2 seconds
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Verification error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('linkedin_email');
        setAuthStatus({ logged_in: false });
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen p-6 space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your LinkedIn integration</p>
            </div>

            {/* LinkedIn Connection Card */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <LinkedinIcon className="w-6 h-6 text-[#0077b5]" />
                    <h2 className="text-xl font-bold text-gray-100">LinkedIn Account</h2>
                </div>

                {authStatus.logged_in ? (
                    // Connected State
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <div>
                                    <p className="font-medium text-gray-200">{authStatus.user?.name}</p>
                                    <p className="text-sm text-gray-400">{authStatus.user?.email}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                                Connected
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Disconnect LinkedIn
                        </button>
                    </div>
                ) : (
                    // Login Form
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                LinkedIn Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                required
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg text-white font-medium transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Connect LinkedIn
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                            We'll ask for OTP verification if LinkedIn requires it.
                        </p>
                    </form>
                )}
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-100 mb-2">Verify Your Identity</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            LinkedIn requires verification. Enter the code sent to your email or tap "Yes" on your phone.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                OTP Code (optional if using mobile)
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                maxLength={6}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 text-center text-2xl tracking-widest placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowOTPModal(false);
                                    setOtp('');
                                    setError('');
                                }}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify'
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            If you're using mobile notification, it may take a few moments. We'll check automatically.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
