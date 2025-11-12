'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { getUser, isAuthenticated } from '../auth';
import { subscribeToAuthChange } from '../auth-events';
import type { User } from '../api';

type AuthSnapshot = {
  authed: boolean;
  user: User | null;
};

let cachedSnapshot: AuthSnapshot = {
  authed: false,
  user: null,
};

const usersEqual = (a: User | null, b: User | null) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.userId === b.userId && a.username === b.username && a.email === b.email;
};

const readSnapshot = (): AuthSnapshot => {
  if (typeof window === 'undefined') {
    return cachedSnapshot;
  }

  const authed = isAuthenticated();
  const user = getUser();

  if (cachedSnapshot.authed !== authed || !usersEqual(cachedSnapshot.user, user)) {
    cachedSnapshot = { authed, user };
  }

  return cachedSnapshot;
};

const getSnapshot = () => readSnapshot();

const getServerSnapshot = () => cachedSnapshot;

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => {
    const next = readSnapshot();
    if (next.authed !== cachedSnapshot.authed || !usersEqual(next.user, cachedSnapshot.user)) {
      cachedSnapshot = next;
      onStoreChange();
    } else {
      onStoreChange();
    }
  };

  const unsubscribeAuth = subscribeToAuthChange(handler);
  window.addEventListener('storage', handler);

  return () => {
    unsubscribeAuth();
    window.removeEventListener('storage', handler);
  };
};

const requestIdle = (cb: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if ('requestIdleCallback' in window) {
    const idleHandle = (
      window as Window & {
        requestIdleCallback: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number;
        cancelIdleCallback: (handle: number) => void;
      }
    ).requestIdleCallback(() => cb(), { timeout: 300 });

    return () => {
      (window as Window & { cancelIdleCallback: (handle: number) => void }).cancelIdleCallback(
        idleHandle
      );
    };
  }

  const timeoutHandle = setTimeout(cb, 200);
  return () => clearTimeout(timeoutHandle);
};

export function useAuthSession() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cancel = requestIdle(() => setHydrated(true));
    return cancel;
  }, []);

  return useMemo(
    () => ({
      ...snapshot,
      hydrated,
    }),
    [snapshot, hydrated]
  );
}
