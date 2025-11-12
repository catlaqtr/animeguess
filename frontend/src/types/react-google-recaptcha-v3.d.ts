declare module 'react-google-recaptcha-v3' {
  import { ReactNode } from 'react';

  export interface GoogleReCaptchaProviderProps {
    reCaptchaKey: string;
    scriptProps?: {
      async?: boolean;
      defer?: boolean;
      appendTo?: 'head' | 'body';
      nonce?: string;
    };
    language?: string;
    container?: string;
    useRecaptchaNet?: boolean;
    enterprise?: boolean;
    children?: ReactNode;
  }

  export interface UseGoogleReCaptchaResult {
    executeRecaptcha?: (action: string) => Promise<string>;
    loaded: boolean;
  }

  export const GoogleReCaptchaProvider: (props: GoogleReCaptchaProviderProps) => JSX.Element;
  export function useGoogleReCaptcha(): UseGoogleReCaptchaResult;
}
