'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionSchema, guessSchema, QuestionFormData, GuessFormData } from '@/lib/validations';
import { logout } from '@/lib/auth';
import { useCurrentGame, useStartGame, useAskQuestion, useSubmitGuess } from '@/lib/hooks/useGame';
import { useAuthSession } from '@/lib/hooks/useAuthSession';
import AdBanner from '@/components/ads/AdBanner';

const adSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '';

export default function GamePage() {
  const router = useRouter();
  const { authed, user, hydrated } = useAuthSession();
  const effectiveAuthed = hydrated && authed;
  const hasAutoStartedRef = useRef(false);

  const [showGuessModal, setShowGuessModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // React Query hooks
  const {
    data: game,
    isLoading,
    error: gameError,
  } = useCurrentGame({
    enabled: effectiveAuthed,
    staleTime: 1000 * 10,
  });
  const { mutate: startGame, isPending: isStarting } = useStartGame();
  const { mutate: askQuestion, isPending: isAsking } = useAskQuestion();
  const { mutate: submitGuess, isPending: isGuessing } = useSubmitGuess();

  const {
    register: registerQuestion,
    handleSubmit: handleSubmitQuestion,
    formState: { errors: questionErrors },
    reset: resetQuestion,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const {
    register: registerGuess,
    handleSubmit: handleSubmitGuess,
    formState: { errors: guessErrors },
    reset: resetGuess,
  } = useForm<GuessFormData>({
    resolver: zodResolver(guessSchema),
  });

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!authed) {
      router.replace('/login');
    }
  }, [authed, hydrated, router]);

  useEffect(() => {
    if (!effectiveAuthed || isLoading || game || hasAutoStartedRef.current) {
      return;
    }

    hasAutoStartedRef.current = true;
    startGame();
  }, [effectiveAuthed, game, isLoading, startGame]);

  useEffect(() => {
    if (game) {
      hasAutoStartedRef.current = false;
    }
  }, [game]);

  // Check if game just ended
  useEffect(() => {
    if (game && (game.status === 'WON' || game.status === 'LOST')) {
      setGameOver(true);
    }
  }, [game]);

  const handleStartNewGame = () => {
    setGameOver(false);
    hasAutoStartedRef.current = true;
    startGame();
  };

  const onAskQuestion = (data: QuestionFormData) => {
    askQuestion(data.question, {
      onSuccess: () => {
        resetQuestion();
      },
    });
  };

  const onSubmitGuess = (data: GuessFormData) => {
    submitGuess(data.characterName, {
      onSuccess: () => {
        setShowGuessModal(false);
        resetGuess();
      },
    });
  };

  if (!hydrated) {
    return null;
  }

  if (gameError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-white">Unable to load your game</h2>
        <p className="max-w-md text-sm text-white/70">
          Something went wrong while loading the current game. Please refresh the page to try again.
        </p>
      </div>
    );
  }

  if (!effectiveAuthed) {
    return null;
  }

  if ((authed && isLoading) || isStarting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-8xl"
        >
          🎌
        </motion.div>
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-3xl font-bold text-white animate-glow"
          style={{ fontFamily: 'Bangers, cursive' }}
        >
          LOADING...
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-5 left-5 text-4xl animate-float opacity-10">⭐</div>
      <div
        className="absolute top-10 right-10 text-5xl animate-float opacity-10"
        style={{ animationDelay: '1s' }}
      >
        ✨
      </div>
      <div
        className="absolute bottom-10 left-10 text-6xl animate-float opacity-10"
        style={{ animationDelay: '2s' }}
      >
        🎯
      </div>
      <div
        className="absolute bottom-5 right-5 text-4xl animate-float opacity-10"
        style={{ animationDelay: '1.5s' }}
      >
        💫
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 relative z-10">
        <div className="anime-card p-5 flex justify-between items-center shadow-2xl">
          <div>
            <h1
              className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
              style={{ fontFamily: 'Bangers, cursive' }}
            >
              🎌 ANIME GUESS GAME
            </h1>
            <p className="text-gray-700 font-semibold">
              Welcome back, <span className="text-purple-600">{user?.username}</span>! 🎮
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/history')}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              📜 History
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              🚪 Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && game && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setGameOver(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{game.guessedCorrectly ? '🎉' : '😢'}</div>
                <h2 className="text-3xl font-bold mb-2">
                  {game.guessedCorrectly ? 'You Won!' : 'Game Over'}
                </h2>
                <p className="text-gray-600 mb-4">
                  The character was: <strong>{game.revealedCharacter}</strong>
                </p>
                <p className="text-gray-500 mb-6">
                  You asked {game.questionsCount} question{game.questionsCount !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={handleStartNewGame}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guess Modal */}
      <AnimatePresence>
        {showGuessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
            onClick={() => setShowGuessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Make Your Guess!</h2>
              <form onSubmit={handleSubmitGuess(onSubmitGuess)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Character Name
                  </label>
                  <input
                    {...registerGuess('characterName')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Monkey D. Luffy"
                    autoFocus
                  />
                  {guessErrors.characterName && (
                    <p className="mt-1 text-sm text-red-600">{guessErrors.characterName.message}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGuessModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGuessing}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  >
                    {isGuessing ? 'Submitting...' : 'Submit Guess'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Conversation Area */}
        <div className="lg:col-span-2">
          <div className="anime-card p-6 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-2xl font-black text-gray-800"
                style={{ fontFamily: 'Bangers, cursive' }}
              >
                💬 CONVERSATION
              </h2>
              <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                {game?.questionsCount || 0} question{game?.questionsCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {!game?.conversationHistory || game.conversationHistory.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p className="text-4xl mb-4">🤔</p>
                  <p>Ask your first question to start!</p>
                </div>
              ) : (
                game.conversationHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* User Question */}
                    <div className="flex justify-end mb-2">
                      <div className="bg-purple-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                        <p>{msg.question}</p>
                      </div>
                    </div>
                    {/* AI Answer */}
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                        <p>{msg.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Question Input */}
            {game && game.status === 'ACTIVE' && (
              <form onSubmit={handleSubmitQuestion(onAskQuestion)} className="flex gap-2">
                <input
                  {...registerQuestion('question')}
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Ask a question about the character..."
                  disabled={isAsking}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isAsking}
                  className="anime-button px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold disabled:opacity-50 shadow-lg"
                >
                  {isAsking ? '⏳' : '❓ Ask'}
                </motion.button>
              </form>
            )}
            {questionErrors.question && (
              <p className="mt-2 text-sm text-red-600">{questionErrors.question.message}</p>
            )}
          </div>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          <div className="anime-card p-6">
            <h3
              className="text-2xl font-black text-gray-800 mb-4"
              style={{ fontFamily: 'Bangers, cursive' }}
            >
              🎯 ACTIONS
            </h3>

            {game && game.status === 'ACTIVE' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGuessModal(true)}
                className="anime-button w-full bg-gradient-to-r from-green-500 to-teal-400 text-white py-4 rounded-xl font-black text-lg mb-4 shadow-xl"
              >
                🎯 MAKE A GUESS!
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartNewGame}
              disabled={isStarting}
              className="anime-button w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-black disabled:opacity-50 shadow-xl"
            >
              {isStarting ? '⏳ Starting...' : '🎮 NEW GAME'}
            </motion.button>
          </div>

          <div className="anime-card p-6">
            <h3
              className="text-2xl font-black text-gray-800 mb-4"
              style={{ fontFamily: 'Bangers, cursive' }}
            >
              💡 HOW TO PLAY
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">1️⃣</span>
                <span>Ask yes/no questions or descriptive questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2️⃣</span>
                <span>The AI will answer based on the character&apos;s data</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3️⃣</span>
                <span>When ready, click &quot;Make a Guess!&quot;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4️⃣</span>
                <span>Enter the character&apos;s name to win!</span>
              </li>
            </ul>
          </div>

          {adSlotId ? (
            <div className="anime-card p-4 text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Sponsored</h3>
              <AdBanner slot={adSlotId} className="mx-auto" />
              <p className="text-xs text-gray-400">Ads help keep Anime Guess Game free.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
