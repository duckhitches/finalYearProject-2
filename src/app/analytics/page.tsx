'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { topics } from '@/api/modules';

interface LearningStats {
  completedModules: number;
  totalModules: number;
  activeTime: string;
  progressRate: number;
  engagement: string;
}

// Error logging utility
const logError = (message: string, error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable no-console */
    console.error(message, error);
    /* eslint-enable no-console */
  }
};

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<LearningStats>({
    completedModules: 0,
    totalModules: topics.length, // Total number of topics from the module API
    activeTime: '0h',
    progressRate: 0,
    engagement: 'Low'
  });
  const router = useRouter();

  const fetchLearningStats = async (uid: string) => {
    try {
      const { data: progressData, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', uid)
        .eq('status', 'completed');

      if (error) throw error;
      
      const completedModules = progressData?.length || 0;
      const progressRate = Math.round((completedModules / stats.totalModules) * 100);
      const activeTime = `${completedModules * 30}m`; // 30 minutes per module

      let engagement = 'Beginner';
      if (completedModules >= stats.totalModules * 0.5) {
        engagement = 'Intermediate';
      }
      if (completedModules >= stats.totalModules * 0.8) {
        engagement = 'Advanced';
      }

      setStats({
        completedModules,
        totalModules: stats.totalModules,
        activeTime,
        progressRate,
        engagement
      });
    } catch (error) {
      logError('Error fetching learning stats:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          router.replace('/auth');
          return;
        }

        setUserId(session.user.id);
        await fetchLearningStats(session.user.id);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_OUT') {
              router.replace('/auth');
            } else if (session) {
              setUserId(session.user.id);
              await fetchLearningStats(session.user.id);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        logError('Error initializing auth:', error);
        router.replace('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const progressChannel = supabase
      .channel('analytics_progress')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchLearningStats(userId);
        }
      )
      .subscribe();

    const handleProgressUpdate = () => {
      fetchLearningStats(userId);
    };

    window.addEventListener('moduleProgressUpdate', handleProgressUpdate);

    return () => {
      progressChannel.unsubscribe();
      window.removeEventListener('moduleProgressUpdate', handleProgressUpdate);
    };
  }, [userId]);

  const displayStats = [
    {
      id: 1,
      name: 'Completed Modules',
      value: `${stats.completedModules}/${stats.totalModules}`,
      change: `${stats.progressRate}%`,
      changeType: 'positive',
    },
    {
      id: 2,
      name: 'Active Learning',
      value: stats.activeTime,
      change: '+0.5h',
      changeType: 'positive',
    },
    {
      id: 3,
      name: 'Progress Rate',
      value: `${stats.progressRate}%`,
      change: '+5%',
      changeType: 'positive',
    },
    {
      id: 4,
      name: 'Engagement',
      value: stats.engagement,
      change: '↑',
      changeType: 'positive',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl space-y-6"
        >
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-center">Learning Analytics</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                    <div className="mt-1 flex items-baseline justify-between">
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 