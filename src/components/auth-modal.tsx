import React, { useState } from 'react';
import { Fingerprint, X, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (username: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            if (mode === 'register') {
                if (!username) throw new Error('Username is required');
                await AuthService.register(username);
                setSuccess('Registration successful! You can now log in.');
                setTimeout(() => {
                    setMode('login');
                    setSuccess(null);
                }, 1500);
            } else {
                if (!username) throw new Error('Username is required');
                await AuthService.login(username);
                setSuccess('Authenticated successfully!');
                setTimeout(() => {
                    onLoginSuccess(username);
                    onClose();
                }, 1000);
            }
        } catch (err: any) {
            console.error(err);
            if (err.name === 'NotAllowedError') {
                setError('Authentication canceled or timed out.');
            } else if (err.message.includes('User already exists')) {
                setError('User already exists. Try logging in.');
            } else if (err.message.includes('User not found')) {
                setError('User not found. Please register first.');
            } else {
                // Handle SimpleWebAuthn specific errors if possible, or fallback
                setError(err.message || 'Something went wrong. Device might not be supported.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-black border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,255,0,0.1)] overflow-hidden">
                {/* Header */}
                <div className="relative p-6 border-b border-white/10 bg-white/5">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#00ff00]/10 flex items-center justify-center mb-2">
                            <Fingerprint className="w-6 h-6 text-[#00ff00]" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-wide">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {mode === 'login'
                                ? 'Authenticate with your device biometrics'
                                : 'Setup secure fingerprint authentication'}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00ff00] transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff00]/50 focus:bg-white/10 transition-all font-mono"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !username}
                            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isLoading || !username
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-[#00ff00] text-black hover:bg-[#00dd00] hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transform hover:-translate-y-0.5'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Scan Fingerprint' : 'Register Fingerprint'}
                                    <Fingerprint className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            {mode === 'login' ? "Don't have an account? " : "Already registered? "}
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    setError(null);
                                    setSuccess(null);
                                }}
                                className="text-[#00ff00] hover:underline font-medium"
                            >
                                {mode === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
