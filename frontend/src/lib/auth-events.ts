'use client';

const AUTH_EVENT = 'anime-guess-game:auth-changed';

export const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

export const subscribeToAuthChange = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
  };
};
