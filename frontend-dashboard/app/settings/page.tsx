"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, LinkedinIcon, Settings as SettingsIcon, Upload, Copy, Check } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function SettingsPage() {
    const [envStatus, setEnvStatus] = useState<any>(null);
    const [cookieStatus, setCookieStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cookieInput, setCookieInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const [envRes, cookieRes] = await Promise.all([
                fetch(`${BACKEND_URL}/api/settings`),
                fetch(`${BACKEND_URL}/api/cookies/status`)
            ]);

            const envData = await envRes.json();
            const cookieData = await cookieRes.json();

            setEnvStatus(envData);
            setCookieStatus(cookieData);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCookies = async () => {
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch(`${BACKEND_URL}/api/cookies/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cookies: cookieInput })
            });

            const data = await res.json();

            if (data.status === 'success') {
                setMessage('✓ Cookies saved successfully!');
                setCookieInput('');
                await checkStatus();
            } else {
                setMessage(`✗ Error: ${data.message}`);
            }
        } catch (err: any) {
            setMessage(`✗ Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const copyExtractionCommand = () => {
        const command = 'python3 extract_linkedin_cookies.py';
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatExpiryDate = (isoDate: string | null) => {
        if (!isoDate) return 'Unknown';
        try {
            return new Date(isoDate).toLocaleString();
        } catch {
            return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
                <p className="text-gray-400 mt-1">Manage LinkedIn session cookies</p>
            </div>

            {/* Cookie Status Card */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <LinkedinIcon className="w-6 h-6 text-[#0077b5]" />
                    <h2 className="text-xl font-bold text-gray-100">LinkedIn Session Status</h2>
                </div>

                {loading ? (
                    <div className="text-gray-400">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {/* Has Cookies */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                {cookieStatus?.has_cookies ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-200">Session Cookies</p>
                                    <p className="text-sm text-gray-400">
                                        {cookieStatus?.has_cookies
                                            ? `${cookieStatus.cookie_count} cookies loaded`
                                            : 'No cookies configured'}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${cookieStatus?.has_cookies
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {cookieStatus?.has_cookies ? 'Active' : 'Missing'}
                            </span>
                        </div>

                        {/* Auth Token */}
                        {cookieStatus?.has_cookies && (
                            <>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        {cookieStatus?.has_auth_token ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-200">LinkedIn Auth Token (li_at)</p>
                                            <p className="text-sm text-gray-400">
                                                {cookieStatus?.has_auth_token ? 'Valid' : 'Missing or invalid'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expiry */}
                                {cookieStatus?.expires_at && (
                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <p className="text-sm text-blue-300">
                                            <span className="font-medium">Expires:</span> {formatExpiryDate(cookieStatus.expires_at)}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Cookies Card */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <Upload className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-bold text-gray-100">Update Session Cookies</h2>
                </div>

                <div className="space-y-4">
                    {/* Instructions */}
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex gap-3">
                            <SettingsIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-300 space-y-2">
                                <p className="font-medium">How to get your cookies:</p>
                                <ol className="list-decimal list-inside space-y-1 text-blue-300/80">
                                    <li>Run the cookie extraction script locally</li>
                                    <li>Login to LinkedIn when the browser opens</li>
                                    <li>Copy the JSON output</li>
                                    <li>Paste it below and click Save</li>
                                </ol>

                                <div className="mt-3 p-3 rounded bg-black/30 font-mono text-xs flex items-center justify-between">
                                    <code className="text-green-400">python3 extract_linkedin_cookies.py</code>
                                    <button
                                        onClick={copyExtractionCommand}
                                        className="ml-2 p-1.5 rounded hover:bg-white/10 transition-colors"
                                        title="Copy command"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cookie Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Paste Cookie JSON:
                        </label>
                        <textarea
                            value={cookieInput}
                            onChange={(e) => setCookieInput(e.target.value)}
                            placeholder='[{"name":"li_at","value":"...","domain":".linkedin.com",...}]'
                            className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`p-3 rounded-lg ${message.startsWith('✓')
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSaveCookies}
                        disabled={!cookieInput.trim() || saving}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Save Cookies
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Environment Variables Card */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <SettingsIcon className="w-6 h-6 text-gray-400" />
                    <h2 className="text-xl font-bold text-gray-100">Environment Variables</h2>
                </div>

                <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm">
                        <span className="text-gray-400">LinkedIn Email:</span>
                        <span className="ml-2 text-gray-200">{envStatus?.linkedinEmail || 'Not set'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm">
                        <span className="text-gray-400">LinkedIn Password:</span>
                        <span className="ml-2 text-gray-200">{envStatus?.hasPassword ? '••••••••' : 'Not set'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
