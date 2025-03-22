'use client';

import { supabase } from '@/lib/supabaseClient';
import UserInfoCard from '@/components/UserInfoCard';
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) {
          router.replace('/auth');
          return;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.replace('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl"
          >
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">👤 Profile</h2>
          <UserInfoCard />
        </div>
      </div>
    </DashboardLayout>
  );
} 