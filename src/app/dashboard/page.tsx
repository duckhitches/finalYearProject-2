'use client';

import { supabase } from '@/lib/supabaseClient';
import LearningModule from '@/components/LearningModule';
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import StatsCard from '@/components/StatsCard';

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
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
        setUserId(user.id);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.replace('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [router]);

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      // Force a re-render of the LearningModule
      setUserId(prevUserId => prevUserId);
    };

    window.addEventListener('moduleProgressUpdate', handleProgressUpdate);

    return () => {
      window.removeEventListener('moduleProgressUpdate', handleProgressUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl space-y-6">
          <h2 className="text-xl font-semibold mb-4">📊 Dashboard</h2>
          {userId && (
            <>
              <StatsCard userId={userId} />
              <LearningModule userId={userId} />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
