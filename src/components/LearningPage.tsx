'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabaseClient';
import { Topic, getTopic, topics as allTopics } from '@/api/modules';

// Error logging utility
const logError = (message: string, error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    
    console.error(message, error);
    /* eslint-enable no-console */
  }
};

export default function LearningPage({ userId, onProgressUpdate }: { userId: string; onProgressUpdate?: (progress: number) => void }) {
  const searchParams = useSearchParams();
  const topicId = parseInt(searchParams.get('topic') || '1');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('video');
  const [completed, setCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTopic = async () => {
      try {
        setIsLoading(true);
        // Reset state when topic changes
        setSelectedAnswer(null);
        setShowCorrectAnswer(false);
        
        // Fetch topic from the module API
        const topicData = await getTopic(topicId);
        setTopic(topicData || null);
        
        // Fetch completion status
        const { data, error } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', userId)
          .eq('module_id', topicId.toString())
          .eq('status', 'completed')
          .single();
        
        if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows returned" error
        setCompleted(!!data);

        // Calculate overall progress
        const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
          .eq('status', 'completed');
        
        if (progressError) throw progressError;
        
        const completedModules = progressData?.length || 0;
        const totalModules = allTopics.length;
        const progress = Math.round((completedModules / totalModules) * 100);
        
        if (onProgressUpdate) {
          onProgressUpdate(progress);
        }
        
        // Dispatch custom event for analytics
        const event = new CustomEvent('moduleProgressUpdate');
        window.dispatchEvent(event);
      } catch (err) {
        logError('Error fetching topic data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTopic();
  }, [topicId, userId, onProgressUpdate]);

  const handleMarkAsCompleted = async () => {
    try {
      // Mark as completed
      const { error } = await supabase
        .from('progress')
        .upsert([{ 
          user_id: userId, 
          module_id: topicId.toString(), 
          status: 'completed',
          completed_at: new Date().toISOString()
        }]);

      if (error) throw error;
    setCompleted(true);
      
      // Calculate progress
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed');
      
      if (progressError) throw progressError;
      
      const completedModules = progressData?.length || 0;
      const totalModules = allTopics.length;
      const progress = Math.round((completedModules / totalModules) * 100);
      
      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }
      
      // Dispatch custom event for analytics
      const event = new CustomEvent('moduleProgressUpdate');
      window.dispatchEvent(event);
    } catch (err) {
      logError('Error marking module as completed:', err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select only image files (PNG, JPG, JPEG)');
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `drawings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('drawings')
        .upload(filePath, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('drawings')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('drawings')
        .insert([
          {
            user_id: userId,
            module_id: topicId.toString(),
            file_path: filePath,
            file_url: publicUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (dbError) throw dbError;

      alert('Your drawing has been uploaded successfully!');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      logError('Error uploading drawing:', error);
      alert('There was an error uploading your drawing. Please try again.');
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Topic not found</p>
        <Button
          variant="outline"
          onClick={() => router.push('/learning')}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
      <Card className="p-3 sm:p-4 md:p-5 lg:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{topic.title}</h2>
        
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="mb-3 sm:mb-4"
        >
          Go Back
        </Button>

        {/* Dropdown for sm/md devices */}
        <div className="block lg:hidden">
          <select
            className="w-full p-2 border rounded-lg mb-3 sm:mb-4"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="video" className="backdrop-blur-sm bg-white/80">Video Lesson</option>
            <option value="theory" className="backdrop-blur-sm bg-white/80">Theory</option>
            <option value="activity" className="backdrop-blur-sm bg-white/80">Activities</option>
          </select>

          {/* Content for sm/md devices */}
          <div className="mt-3 sm:mt-4">
            {activeTab === 'video' && (
              <div className="w-full rounded-lg overflow-hidden" style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={`${topic.videoUrl}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            )}

            {activeTab === 'theory' && (
              <div className="space-y-4 sm:space-y-5">
                {topic.theory.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-lg p-4 sm:p-5 shadow-sm"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">{section.title}</h3>
                    <p className="text-gray-600 mb-3 leading-relaxed">{section.content}</p>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold mb-2">Key Points:</h4>
                      <ul className="list-disc list-inside space-y-1.5">
                        {section.keyPoints.map((point, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.2) + (idx * 0.1) }}
                            className="text-gray-700"
                          >
                            {point}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4 sm:space-y-5">
                {topic.interactiveElements.map((element, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    {element.type === 'quiz' && 'options' in element && element.options && (
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold">{element.question}</h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          {element.options.map((option) => (
                            <Button
                              key={option}
                              variant={selectedAnswer === option ? "default" : "outline"}
                              onClick={() => {
                                setSelectedAnswer(option);
                                setShowCorrectAnswer(true);
                              }}
                              className={`w-full text-sm sm:text-base ${
                                showCorrectAnswer
                                  ? option === element.correctAnswer
                                    ? "bg-green-500 hover:bg-green-600"
                                    : selectedAnswer === option
                                    ? "bg-red-500 hover:bg-red-600"
                                    : ""
                                  : ""
                              }`}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        {showCorrectAnswer && (
                          <p className="text-sm mt-2">
                            {selectedAnswer === element.correctAnswer 
                              ? "✅ Correct!" 
                              : `❌ The correct answer is: ${element.correctAnswer}`}
                          </p>
                        )}
                      </div>
                    )}
                    {element.type === 'activity' && 'dragDropItems' in element && element.dragDropItems && (
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold">Add your drawings here</h3>
                        <p className="text-sm text-gray-600">Upload your drawings or images to share your creativity!</p>
                        
                        <div className="space-y-3 sm:space-y-4">
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors duration-300 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="space-y-2">
                              <div className="text-3xl sm:text-4xl mb-2">🎨</div>
                              <p className="text-sm sm:text-base text-gray-600">Click to upload your drawing</p>
                              <p className="text-xs sm:text-sm text-gray-500">Supported formats: PNG, JPG, JPEG</p>
                            </div>
                          </div>

                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                          />

                          {imagePreview && (
                            <div className="relative group">
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <img
                                  src={imagePreview}
                                  alt="Your drawing"
                                  className="w-full h-full object-contain bg-gray-50"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                                    <Button
                                      onClick={handleImageUpload}
                                      className="bg-green-500 hover:bg-green-600 text-sm sm:text-base"
                                    >
                                      Submit
                                    </Button>
                                    <Button
                                      onClick={handleImageDelete}
                                      variant="destructive"
                                      className="text-sm sm:text-base"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs for lg devices */}
        <Tabs defaultValue="video" className="hidden lg:block w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video" className="backdrop-blur-sm bg-white/80">Video Lesson</TabsTrigger>
            <TabsTrigger value="theory" className="backdrop-blur-sm bg-white/80">Theory</TabsTrigger>
            <TabsTrigger value="activity" className="backdrop-blur-sm bg-white/80">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="mt-4">
            <div className="w-full rounded-lg overflow-hidden" style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`${topic.videoUrl}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </TabsContent>

          <TabsContent value="theory" className="mt-4">
            <div className="space-y-6">
              {topic.theory.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{section.content}</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Key Points:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      {section.keyPoints.map((point, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.2) + (idx * 0.1) }}
                          className="text-gray-700"
                        >
                          {point}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="space-y-6">
              {topic.interactiveElements.map((element, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  {element.type === 'quiz' && 'options' in element && element.options && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{element.question}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {element.options.map((option) => (
                          <Button
                            key={option}
                            variant={selectedAnswer === option ? "default" : "outline"}
                            onClick={() => {
                              setSelectedAnswer(option);
                              setShowCorrectAnswer(true);
                            }}
                            className={`w-full ${
                              showCorrectAnswer
                                ? option === element.correctAnswer
                                  ? "bg-green-500 hover:bg-green-600"
                                  : selectedAnswer === option
                                  ? "bg-red-500 hover:bg-red-600"
                                  : ""
                                : ""
                            }`}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                      {showCorrectAnswer && (
                        <p className="text-sm mt-2">
                          {selectedAnswer === element.correctAnswer 
                            ? "✅ Correct!" 
                            : `❌ The correct answer is: ${element.correctAnswer}`}
                        </p>
                      )}
                    </div>
                  )}
                  {element.type === 'activity' && 'dragDropItems' in element && element.dragDropItems && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Add your drawings here</h3>
                      <p className="text-gray-600">Upload your drawings or images to share your creativity!</p>
                      
                      <div className="space-y-4">
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-300 cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="space-y-2">
                            <div className="text-4xl mb-2">🎨</div>
                            <p className="text-gray-600">Click to upload your drawing</p>
                            <p className="text-sm text-gray-500">Supported formats: PNG, JPG, JPEG</p>
                          </div>
                        </div>

                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageSelect}
                        />

                        {imagePreview && (
                          <div className="relative group">
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                              <img
                                src={imagePreview}
                                alt="Your drawing"
                                className="w-full h-full object-contain bg-gray-50"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                                  <Button
                                    onClick={handleImageUpload}
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    Submit
                                  </Button>
                                  <Button
                                    onClick={handleImageDelete}
                                    variant="destructive"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 sm:mt-5 lg:mt-6 space-y-3 sm:space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleMarkAsCompleted}
              disabled={completed}
              className={`w-full transition-colors duration-300 text-sm sm:text-base ${
                completed ? 'bg-black hover:bg-black/90 text-white cursor-not-allowed' : ''
              }`}
            >
              {completed ? 'Completed ✅' : 'Mark as Completed'}
            </Button>
          </motion.div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={topicId === 1}
              onClick={() => router.push(`/learning?topic=${topicId - 1}`)}
              className="text-sm sm:text-base"
            >
              ⬅ Previous
            </Button>
            <Button
              variant="outline"
              disabled={topicId === allTopics.length}
              onClick={() => router.push(`/learning?topic=${topicId + 1}`)}
              className="text-sm sm:text-base"
            >
              Next ➡
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
