'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { categories } from '@/api/modules';
import ProgressBar from './ProgressBar';

interface ModuleProgress {
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface LearningModuleProps {
  userId: string;
}

export default function LearningModule({ userId }: LearningModuleProps) {
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchModuleProgress = async () => {
    try {
      const { data: progressData, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const progress = progressData?.map(p => ({
        moduleId: p.module_id,
        status: p.status
      })) || [];

      setModuleProgress(progress);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching module progress:', error);
      }
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.replace('/auth');
          return;
        }

        await fetchModuleProgress();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching modules:', error);
        }
        router.replace('/auth');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchModules();
    } else {
      setLoading(false);
    }
  }, [userId, router]);

  // Subscribe to progress changes
  useEffect(() => {
    if (!userId) return;

    const progressChannel = supabase
      .channel('progress_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchModuleProgress();
        }
      )
      .subscribe();

    const handleProgressUpdate = () => {
      fetchModuleProgress();
    };

    window.addEventListener('moduleProgressUpdate', handleProgressUpdate);

    return () => {
      progressChannel.unsubscribe();
      window.removeEventListener('moduleProgressUpdate', handleProgressUpdate);
    };
  }, [userId]);

  const handleContinueModule = (moduleId: number) => {
    router.push(`/learning?topic=${moduleId}`);
  };

  const isModuleCompleted = (moduleId: number) => {
    return moduleProgress.some(p => p.moduleId === moduleId.toString() && p.status === 'completed');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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

  if (!userId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <Card>
          <CardContent className="text-center p-6">
            <p className="text-gray-600">Please sign in to view learning modules.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <ProgressBar userId={userId} />
          </CardContent>
        </Card>

        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
              <div className="grid gap-4">
                {category.modules.map((module) => {
                  const completed = isModuleCompleted(module.id);
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg transition-colors duration-300 ${
                        completed ? 'bg-black text-white shadow-lg' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${completed ? 'text-white' : 'text-gray-900'}`}>
                            {module.title}
                          </h4>
                          <p className={`text-sm mt-1 ${completed ? 'text-gray-300' : 'text-gray-600'}`}>
                            {module.description}
                          </p>
                        </div>
                        <Button
                          variant={completed ? "outline" : "default"}
                          onClick={() => handleContinueModule(module.id)}
                          className={`${
                            completed 
                              ? 'border-white text-black hover:bg-white hover:text-black transition-colors duration-300' 
                              : ''
                          }`}
                        >
                          {completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
