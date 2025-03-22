'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SplineViewerProps {
  scene: string;
}

export default function SplineViewer({ scene }: SplineViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert scene URL to embed URL
  const embedUrl = scene.replace('spline.design/', 'spline.design/embed/');

  return (
    <div className="w-full h-full min-h-[400px] relative bg-gray-50 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      <iframe
        src={embedUrl}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError('Failed to load 3D content. Please try refreshing the page.');
          setIsLoading(false);
        }}
        className="w-full h-full min-h-[400px]"
        style={{ 
          border: 'none',
          borderRadius: '0.5rem',
          backgroundColor: 'transparent'
        }}
        title="Spline Scene"
        loading="lazy"
        allow="autoplay; camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
      />
    </div>
  );
} 