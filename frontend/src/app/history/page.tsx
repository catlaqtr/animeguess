'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isAuthenticated, logout } from '@/lib/auth';
import { useGameHistory } from '@/lib/hooks/useGame';

export default function HistoryPage() {
  const router = useRouter();
  const { data: games = [], isLoading } = useGameHistory();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">📊 Game History</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/game')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
            >
              Back to Game
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="max-w-6xl mx-auto">
        {games.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-4xl mb-4">🎮</p>
            <p className="text-gray-600 text-lg">No games played yet. Start your first game!</p>
            <button
              onClick={() => router.push('/game')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600"
            >
              Play Now
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {games.map((game, index) => (
              <motion.div
                key={game.gameId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">
                        {game.status === 'WON' ? '🎉' : '😢'}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold">
                          {game.status === 'WON' ? 'Victory!' : 'Better luck next time'}
                        </h3>
                        <p className="text-gray-600">
                          Character: <strong>{game.revealedCharacter}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(game.startedAt).toLocaleDateString()}</p>
                    <p>{new Date(game.startedAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Questions Asked</p>
                    <p className="text-2xl font-bold text-purple-600">{game.questionsCount}</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Your Guess</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {game.finalGuess || 'N/A'}
                    </p>
                  </div>
                </div>

                {game.conversationHistory && game.conversationHistory.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-purple-600 font-semibold hover:text-purple-700">
                      View Conversation ({game.conversationHistory.length} messages)
                    </summary>
                    <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
                      {game.conversationHistory.map((msg, idx) => (
                        <div key={idx} className="border-l-4 border-purple-300 pl-3 py-1">
                          <p className="font-semibold text-sm text-gray-700">Q: {msg.question}</p>
                          <p className="text-sm text-gray-600">A: {msg.answer}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

