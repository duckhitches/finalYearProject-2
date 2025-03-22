import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import GameViewer from './GameViewer';
import { useState } from 'react';

const games = [
  {
    id: 1,
    title: "Word Connections",
    url: "https://cdn-factory.marketjs.com/en/word-connections/index.html",
    description: "Connect words and expand your vocabulary!"
  },
  {
    id: 2,
    title: "Daily Wordler",
    url: "https://cdn-factory.marketjs.com/en/daily-wordler/index.html",
    description: "Challenge yourself with daily word puzzles!"
  },
  {
    id: 3,
    title: "Happy Blast Cannon",
    url: "https://cdn-factory.marketjs.com/en/happy-blast-cannon/index.html",
    description: "Test your aim and have fun with this exciting game!"
  },
  {
    id: 4,
    title: "Water Bomber",
    url: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    description: "Help put out fires and save the day!"
  }
];

export default function GamesSection() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">🎮 Games</h2>
        
        {selectedGame ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Button
                variant="outline"
                onClick={() => setSelectedGame(null)}
                className="mb-4"
              >
                ← Back to Games
              </Button>
              <h3 className="text-xl font-semibold mb-4">
                {games.find(g => g.id === selectedGame)?.title}
              </h3>
              <GameViewer gameUrl={games.find(g => g.id === selectedGame)?.url || ''} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: game.id * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
                    <p className="text-gray-600">{game.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 