'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GameViewerProps {
  gameUrl: string;
}

export default function GameViewer({ gameUrl }: GameViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-full min-h-[600px] relative bg-gray-50 rounded-lg overflow-hidden">
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
        src={gameUrl}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError('Failed to load game content. Please try refreshing the page.');
          setIsLoading(false);
        }}
        className="w-full h-full min-h-[600px]"
        style={{ 
          border: 'none',
          borderRadius: '0.5rem',
          backgroundColor: 'transparent'
        }}
        title="Interactive Game"
        loading="lazy"
        allow="autoplay; fullscreen"
      />
    </div>
  );
} 