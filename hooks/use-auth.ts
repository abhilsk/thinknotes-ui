"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export interface AuthUser {
  userId: string;
  email?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasOAuthCode =
      typeof window !== "undefined" && new URLSearchParams(window.location.search).has("code");

    if (hasOAuthCode) {
      pollForSession();
    } else {
      checkAuth();
    }

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (
        payload.event === "signedIn" ||
        payload.event === "signInWithRedirect" ||
        payload.event === "signedOut" ||
        payload.event === "tokenRefresh"
      ) {
        checkAuth();
        cleanOAuthParams();
      }
    });
    return unsubscribe;
  }, []);

  function cleanOAuthParams() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("code") || url.searchParams.has("state")) {
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }

  async function pollForSession() {
    for (let i = 0; i < 15; i++) {
      try {
        const currentUser = await getCurrentUser();
        setUser({ userId: currentUser.userId, email: currentUser.signInDetails?.loginId });
        setLoading(false);
        cleanOAuthParams();
        return;
      } catch {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    setUser(null);
    setLoading(false);
  }

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      setUser({
        userId: currentUser.userId,
        email: currentUser.signInDetails?.loginId,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return { user, loading, refetch: checkAuth };
}
