'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { topics } from '@/api/modules';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  userId: string;
  onProgressUpdate?: (progress: number) => void;
}

interface ModuleProgress {
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export default function ProgressBar({ userId, onProgressUpdate }: ProgressBarProps) {
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Create a map of module progress
      const progressMap = new Map<string, string>();
      data?.forEach(entry => {
        progressMap.set(entry.module_id, entry.status);
      });

      // Create array of all modules with their progress status
      const progress = topics.map(topic => ({
        moduleId: topic.id.toString(),
        status: (progressMap.get(topic.id.toString()) || 'not_started') as ModuleProgress['status']
      }));

      setModuleProgress(progress);

      // Calculate overall progress
      const completedModules = progress.filter(m => m.status === 'completed').length;
      const progressPercentage = Math.round((completedModules / topics.length) * 100);

      if (onProgressUpdate) {
        onProgressUpdate(progressPercentage);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();

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
          fetchProgress();
        }
      )
      .subscribe();

    // Listen for custom events
    const handleProgressUpdate = () => {
      fetchProgress();
    };
    window.addEventListener('moduleProgressUpdate', handleProgressUpdate);

    return () => {
      progressChannel.unsubscribe();
      window.removeEventListener('moduleProgressUpdate', handleProgressUpdate);
    };
  }, [userId, onProgressUpdate]);

  if (isLoading) {
    return (
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="animate-pulse h-full bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  const completedModules = moduleProgress.filter(m => m.status === 'completed').length;
  const progressPercentage = Math.round((completedModules / topics.length) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
        <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-black"
        />
      </div>
    </div>
  );
} 