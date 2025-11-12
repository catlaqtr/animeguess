import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { gameAPI, type GameResponse, type QuestionAnswerResponse } from '../api';

// Query Keys
export const gameKeys = {
  all: ['games'] as const,
  current: () => [...gameKeys.all, 'current'] as const,
  history: () => [...gameKeys.all, 'history'] as const,
};

// Get current active game
type CurrentGameOptions = Pick<
  UseQueryOptions<
    GameResponse | null,
    unknown,
    GameResponse | null,
    ReturnType<typeof gameKeys.current>
  >,
  'enabled' | 'staleTime'
>;

export function useCurrentGame(options?: CurrentGameOptions) {
  return useQuery({
    queryKey: gameKeys.current(),
    queryFn: gameAPI.getCurrentGame,
    retry: false, // Don't retry if no active game (404)
    ...options,
  });
}

// Get game history
export function useGameHistory() {
  return useQuery({
    queryKey: gameKeys.history(),
    queryFn: gameAPI.getGameHistory,
  });
}

// Start new game
export function useStartGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gameAPI.startGame,
    onSuccess: (data: GameResponse) => {
      // Update current game cache
      queryClient.setQueryData(gameKeys.current(), data);
      // Invalidate history to refetch
      queryClient.invalidateQueries({ queryKey: gameKeys.history() });
    },
  });
}

// Ask question
export function useAskQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: string) => gameAPI.askQuestion(question),
    onSuccess: (data: QuestionAnswerResponse) => {
      // Optimistically update current game
      queryClient.setQueryData(gameKeys.current(), (oldData: GameResponse | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          questionsCount: data.totalQuestions,
          conversationHistory: [
            ...oldData.conversationHistory,
            {
              question: data.question,
              answer: data.answer,
              askedAt: new Date().toISOString(),
            },
          ],
        };
      });
    },
  });
}

// Submit guess
export function useSubmitGuess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (characterName: string) => gameAPI.submitGuess(characterName),
    onSuccess: (data: GameResponse) => {
      // Update current game with final result
      queryClient.setQueryData(gameKeys.current(), data);
      // Invalidate history to show new completed game
      queryClient.invalidateQueries({ queryKey: gameKeys.history() });
    },
  });
}
