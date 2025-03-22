'use client';

import { supabase } from '@/lib/supabaseClient';
import LearningPage from '@/components/LearningPage';
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Category, getCategories } from '@/api/modules';

// Error logging utility
const logError = (message: string, error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable no-console */
    console.error(message, error);
    /* eslint-enable no-console */
  }
};

export default function Learning() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const handleProgressUpdate = async (progress: number) => {
    if (userId) {
      const event = new CustomEvent('moduleProgressUpdate', { detail: { progress } });
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        
        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          router.replace('/auth');
          return;
        }
        setUserId(user.id);

        // Fetch categories from the module API
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        logError('Error initializing page:', error);
        router.replace('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">📚 Learning Progress</h2>
          {userId && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Available Categories:</h3>
                <div className="grid gap-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="p-4">
                      <h4 className="text-md font-semibold">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      <div className="mt-2 space-y-2">
                        {category.modules.map((module) => (
                          <div key={module.id} className="text-sm">
                            • {module.title}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <LearningPage userId={userId} onProgressUpdate={handleProgressUpdate} />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
