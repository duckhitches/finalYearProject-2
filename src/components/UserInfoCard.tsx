'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  email: string;
  created_at: string;
  last_sign_in: string;
}

export default function UserInfoCard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          router.replace('/auth');
          return;
        }

        setUserInfo({
          email: session.user.email || 'No email provided',
          created_at: new Date(session.user.created_at).toLocaleDateString(),
          last_sign_in: session.user.last_sign_in_at 
            ? new Date(session.user.last_sign_in_at).toLocaleDateString()
            : 'Never'
        });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (event === 'SIGNED_OUT') {
              router.replace('/auth');
            } else if (currentSession) {
              setUserInfo({
                email: currentSession.user.email || 'No email provided',
                created_at: new Date(currentSession.user.created_at).toLocaleDateString(),
                last_sign_in: currentSession.user.last_sign_in_at 
                  ? new Date(currentSession.user.last_sign_in_at).toLocaleDateString()
                  : 'Never'
              });
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        router.replace('/auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full"
      >
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!userInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full"
      >
        <Card>
          <CardContent className="text-center p-6">
            <p className="text-gray-600 font-montserrat-regular">Unable to load user information.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <h2 className="text-xl sm:text-2xl font-montserrat-bold text-center">User Information</h2>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-montserrat-medium text-gray-500 mb-2 sm:mb-0">Email</h3>
              <p className="text-base sm:text-lg font-montserrat-semibold">{userInfo.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-montserrat-medium text-gray-500 mb-2 sm:mb-0">Account Created</h3>
              <p className="text-base sm:text-lg font-montserrat-semibold">{userInfo.created_at}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-montserrat-medium text-gray-500 mb-2 sm:mb-0">Last Sign In</h3>
              <p className="text-base sm:text-lg font-montserrat-semibold">{userInfo.last_sign_in}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
