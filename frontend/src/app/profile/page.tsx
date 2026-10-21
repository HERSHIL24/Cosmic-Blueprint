"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:8001/api/auth/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(200,150,50,0.1)]"
      >
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white mb-2">Cosmic Profile</h1>
            <p className="text-slate-400">Manage your astrological journey</p>
          </div>
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-3xl text-primary font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            {user?.first_name?.[0] || user?.username?.[0] || '?'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Name</p>
              <p className="text-lg text-white font-medium">{user?.first_name} {user?.last_name}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Username</p>
              <p className="text-lg text-white font-medium">@{user?.username}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Email</p>
              <p className="text-lg text-white font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Cosmic Details</h3>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Birth Date</p>
              <p className="text-lg text-white font-medium">{user?.birth_date || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Birth Time</p>
              <p className="text-lg text-white font-medium">{user?.birth_time || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-1">Member Since</p>
              <p className="text-lg text-white font-medium">{new Date(user?.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-800">
          <h3 className="text-2xl font-bold text-white mb-4">History & Saved Reports</h3>
          <p className="text-slate-400 mb-6">Your past synthesized profiles and charts will appear here.</p>
          <Button onClick={() => router.push('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-xl hover:scale-105 transition-all">
            Synthesize New Profile
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
