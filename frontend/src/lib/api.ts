import axios, { isAxiosError } from 'axios';
import { emitAuthChange } from './auth-events';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      emitAuthChange();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  userId: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface GameResponse {
  gameId: number;
  status: 'ACTIVE' | 'WON' | 'LOST';
  questionsCount: number;
  startedAt: string;
  endedAt?: string;
  guessedCorrectly: boolean;
  finalGuess?: string;
  revealedCharacter?: string;
  conversationHistory: QuestionResponse[];
}

export interface QuestionResponse {
  question: string;
  answer: string;
  askedAt: string;
}

export interface QuestionAnswerResponse {
  question: string;
  answer: string;
  totalQuestions: number;
}

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  requestPasswordReset: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/password-reset/request', data);
    return response.data;
  },

  validateResetToken: async (token: string): Promise<MessageResponse> => {
    const response = await api.get<MessageResponse>('/auth/password-reset/validate', {
      params: { token },
    });
    return response.data;
  },

  confirmPasswordReset: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/password-reset/confirm', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const response = await api.get<MessageResponse>('/auth/verify-email', { params: { token } });
    return response.data;
  },

  resendVerificationEmail: async (data: ResendVerificationRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/resend-verification', data);
    return response.data;
  },
};

// Game API
export const gameAPI = {
  startGame: async (): Promise<GameResponse> => {
    const response = await api.post<GameResponse>('/game/start');
    return response.data;
  },

  askQuestion: async (question: string): Promise<QuestionAnswerResponse> => {
    const response = await api.post<QuestionAnswerResponse>('/game/ask', { question });
    return response.data;
  },

  submitGuess: async (characterName: string): Promise<GameResponse> => {
    const response = await api.post<GameResponse>('/game/guess', { characterName });
    return response.data;
  },

  getCurrentGame: async (): Promise<GameResponse | null> => {
    try {
      const response = await api.get<GameResponse>('/game/current');
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getGameHistory: async (): Promise<GameResponse[]> => {
    const response = await api.get<GameResponse[]>('/game/history');
    return response.data;
  },
};
