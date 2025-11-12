import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  authAPI,
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ResendVerificationRequest,
} from '../api';
import { handleAuthResponse } from '../auth';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response: AuthResponse) => {
      handleAuthResponse(response);
      router.push('/game');
    },
  });
}

export function useRegister(onSuccess?: (response: MessageResponse) => void) {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess,
  });
}

export function useForgotPassword(onSuccess?: (response: MessageResponse) => void) {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authAPI.requestPasswordReset(data),
    onSuccess,
  });
}

export function useResetPassword(onSuccess?: (response: MessageResponse) => void) {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authAPI.confirmPasswordReset(data),
    onSuccess,
  });
}

export function useResendVerification(onSuccess?: (response: MessageResponse) => void) {
  return useMutation({
    mutationFn: (data: ResendVerificationRequest) => authAPI.resendVerificationEmail(data),
    onSuccess,
  });
}
