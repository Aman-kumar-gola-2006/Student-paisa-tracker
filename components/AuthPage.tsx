import React, { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { User } from '../types';

interface AuthPageProps {
    onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let user;
            if (isLogin) {
                user = await apiService.login(email, password, undefined, undefined, 'Email');
                toast.success(`Welcome back, ${user.name}!`);
            } else {
                user = await apiService.register(name, email, password, contact);
                toast.success(`Welcome to Student Paisa Tracker, ${user.name}!`);
            }
            onLogin(user);
        } catch (error: any) {
            toast.error(error.message || (isLogin ? "Login failed" : "Registration failed"));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleMock = async () => {
        setLoading(true);
        try {
            // Mocking google login for now as per previous logic, but routing through new login structure if needed
            // For now, let's keep the previous demo logic but via standard apiService
            const user = await apiService.login("demo@google.com", undefined, "Demo Student", undefined, 'Google');
            onLogin(user);
            toast.success("Logged in with Google!");
        } catch (error) {
            toast.error("Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Student Paisa Tracker</h1>
                    <p className="text-gray-400">
                        {isLogin ? 'Sign in to manage your budget' : 'Create an account to start tracking'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:outline-none focus:border-indigo-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:outline-none focus:border-indigo-500"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:outline-none focus:border-indigo-500"
                            placeholder="student@college.edu"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-3">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleMock}
                        disabled={loading}
                        className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Google
                    </button>
                </div>

                <p className="mt-6 text-center text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};
