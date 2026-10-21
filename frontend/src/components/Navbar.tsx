"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Star, Sun, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Star className="w-5 h-5 absolute" />
              <Moon className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-3 -translate-y-2" />
              <Sun className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-3 translate-y-2" />
            </div>
            <span className="font-heading font-bold text-xl tracking-wider text-foreground">
              Cosmic Blueprint
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-2 ml-4"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center relative p-1 bg-muted/30 rounded-lg">
                <Link 
                  href="/login" 
                  className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === '/login' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {pathname === '/login' && (
                    <motion.div
                      layoutId="nav-auth-bg"
                      className="absolute inset-0 bg-primary rounded-md shadow-sm shadow-primary/20 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === '/register' || (pathname !== '/login' && pathname !== '/register') ? 'text-primary-foreground' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {(pathname === '/register' || (pathname !== '/login' && pathname !== '/register')) && (
                    <motion.div
                      layoutId="nav-auth-bg"
                      className="absolute inset-0 bg-primary rounded-md shadow-sm shadow-primary/20 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
