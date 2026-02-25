'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = isLogin
        ? await api.login(email, password)
        : await api.signup(email, password);
      localStorage.setItem('token', result.access_token);
      window.location.href = '/profile';
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 pt-12 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-navy-950">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-sm text-navy-500 mt-1">
          {isLogin ? 'Sign in to access your reviews' : 'Join the community of verified renters'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" required />
        
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit"
          className="w-full bg-navy-950 text-white py-3 rounded-xl font-medium hover:bg-navy-800 transition">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-navy-400">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} className="text-gold-600 underline">
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
