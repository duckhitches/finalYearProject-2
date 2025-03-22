'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
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

interface StatsCardProps {
  userId: string;
}

export default function StatsCard({ userId }: StatsCardProps) {
  const [stats, setStats] = useState<LearningStats>({
    completedModules: 0,
    totalModules: topics.length,
    activeTime: '0h',
    progressRate: 0,
    engagement: 'Low'
  });

  const fetchLearningStats = async () => {
    try {
      // Fetch progress data
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (progressError) throw progressError;

      // Calculate statistics
      const completedModules = progressData?.length || 0;
      const totalModules = topics.length;
      const progressRate = Math.round((completedModules / totalModules) * 100);

      // Calculate active time (assuming 30 minutes per completed module)
      const activeTime = `${completedModules * 30}m`; // in minutes as string

      // Calculate engagement level
      let engagementLevel = 'Beginner';
      if (completedModules >= totalModules * 0.5) {
        engagementLevel = 'Intermediate';
      }
      if (completedModules >= totalModules * 0.8) {
        engagementLevel = 'Advanced';
      }

      setStats({
        completedModules,
        totalModules,
        activeTime,
        progressRate,
        engagement: engagementLevel
      });
    } catch (error) {
      logError('Error fetching learning stats:', error);
    }
  };

  useEffect(() => {
    fetchLearningStats();

    // Subscribe to progress changes
    const progressChannel = supabase
      .channel('progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchLearningStats();
        }
      )
      .subscribe();

    // Listen for custom events
    const handleProgressUpdate = () => {
      fetchLearningStats();
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
      change: '+0.5h per module',
      changeType: 'positive',
    },
    {
      id: 3,
      name: 'Progress Rate',
      value: `${stats.progressRate}%`,
      change: 'Overall completion',
      changeType: 'positive',
    },
    {
      id: 4,
      name: 'Engagement',
      value: stats.engagement,
      change: 'Based on progress',
      changeType: 'positive',
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: stat.id * 0.1 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
