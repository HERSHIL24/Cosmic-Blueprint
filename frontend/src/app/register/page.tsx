"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8001/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, password_confirm: formData.password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMessage = data.detail || (data.username && `Username: ${data.username[0]}`) || (data.email && `Email: ${data.email[0]}`) || (data.password && `Password: ${data.password[0]}`) || (data.non_field_errors && data.non_field_errors[0]) || 'Registration failed';
        throw new Error(errorMessage);
      }

      // Automatically log in after registration
      const loginRes = await fetch('http://127.0.0.1:8001/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        localStorage.setItem('token', loginData.access);
        localStorage.setItem('refresh_token', loginData.refresh);
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center relative z-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-slate-950/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-[0_0_50px_rgba(200,150,50,0.15)]"
      >
        <h2 className="text-3xl font-heading font-bold text-center mb-6 text-white tracking-wide">Begin Your Journey</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-900/40 border border-red-500 rounded-lg text-red-200 text-sm text-center font-medium shadow-inner">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-slate-300 font-medium">First Name</Label>
              <Input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-slate-300 font-medium">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300 font-medium">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>

          <Button type="submit" className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 font-bold tracking-wider rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]" disabled={loading}>
            {loading ? 'Creating Profile...' : 'SIGN UP'}
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-400 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
