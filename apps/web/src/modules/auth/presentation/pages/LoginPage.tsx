import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../application/context';
import { useNotification } from '@/shared/context/notification';
import { LoginDTO } from '@buyandbye/core';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();
  const { success, error: showError } = useNotification();

  const [formData, setFormData] = useState<LoginDTO>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showError('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData);
      success('Welcome back!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className={`${styles.page} flex min-h-screen items-center`}>
      <div className="ml-auto w-full max-w-md px-6 md:mr-20">
        <div className="rounded-3xl bg-white/10 p-10 shadow-2xl backdrop-blur-lg border border-white/20">
  
          <h1 className="text-3xl font-semibold text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Sign in to continue your live shopping experience.
          </p>
  
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
  
            <div className="space-y-2">
              <label className="text-sm text-white/90">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-xl bg-white/15 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="user@buyandbye.com"
              />
            </div>
  
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/90">
                <label>Password</label>
                <Link
                  to="/forgot-password"
                  className="text-orange-300 hover:text-orange-200"
                >
                  Forgot?
                </Link>
              </div>
  
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl bg-white/15 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
  
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
  
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/30" />
              <span className="text-xs text-white/80">OR</span>
              <div className="h-px flex-1 bg-white/30" />
            </div>
  
            <button
              type="button"
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              Sign in with Google
            </button>
  
            <p className="text-center text-sm text-white/90">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-orange-300 hover:text-orange-200"
              >
                Create one
              </Link>
            </p>
  
          </form>
        </div>
      </div>
    </div>
  );
  
};
