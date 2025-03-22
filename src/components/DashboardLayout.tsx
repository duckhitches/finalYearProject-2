'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Variants } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';


// Menu items configuration
const menuItems = [
  { name: 'Dashboard', color: '#FF008C', path: '/dashboard' },
  { name: 'Analytics', color: '#D309E1', path: '/analytics' },
  { name: 'Games', color: '#7700FF', path: '/games' },
  { name: 'Profile', color: '#4400FF', path: '/profile' }
];

// Animation variants
const menuItemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

const menuListVariants: Variants = {
  open: {
    transition: { 
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  },
  closed: {
    transition: { 
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Hamburger Menu Icon Component
const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="stroke-current"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <motion.line
      x1="4"
      y1="6"
      x2="20"
      y2="6"
      animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.2 }}
    />
    <motion.line
      x1="4"
      y1="12"
      x2="20"
      y2="12"
      animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
    <motion.line
      x1="4"
      y1="18"
      x2="20"
      y2="18"
      animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.2 }}
    />
  </motion.svg>
);

// MenuItem Component
const MenuItem = ({ name, color, path }: { name: string; color: string; path: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <motion.li
      variants={menuItemVariants}
      className={`flex items-center space-x-4 px-4 py-3 hover:bg-gray-700 rounded-lg cursor-pointer ${
        isActive ? 'bg-gray-700' : ''
      }`}
      onClick={() => router.push(path)}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-white">{name}</span>
    </motion.li>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push('/auth');
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/auth');
      }
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-montserrat">
      {/* Top Navigation Bar */}
      <header className="bg-gray-800 text-white fixed w-full z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -ml-2 lg:hidden hover:bg-gray-700 rounded-lg"
            >
              <MenuIcon isOpen={isOpen} />
            </button>
            <h1 
              onClick={() => router.push('/')} 
              className="text-lg font-montserrat-semibold cursor-pointer hover:text-gray-300 transition-colors"
            >
              Children's Rights
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-xs font-montserrat-regular text-gray-300 hidden sm:block">
                {user.email}
              </span>
            )}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="font-montserrat-medium text-white border-white bg-black hover:bg-gray-700 text-xs"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row pt-[60px]">
        {/* Sidebar for large screens */}
        <aside className="hidden lg:block w-64 fixed h-[calc(100vh-60px)] bg-gray-800">
          <nav className="p-4">
            <motion.ul className="space-y-2">
              {menuItems.map((item) => (
                <MenuItem key={item.name} {...item} />
              ))}
            </motion.ul>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="fixed top-[60px] left-0 w-64 h-[calc(100vh-60px)] bg-gray-800 z-50 lg:hidden"
              >
                <nav className="p-4">
                  <motion.ul
                    variants={menuListVariants}
                    initial="closed"
                    animate="open"
                    className="space-y-2"
                  >
                    {menuItems.map((item) => (
                      <MenuItem key={item.name} {...item} />
                    ))}
                  </motion.ul>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
