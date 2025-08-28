import { useEffect, useState } from "react";

export interface NeynarUser {
  fid: number;
  username: string;
  displayName?: string;
  pfp?: {
    url: string;
  };
  followerCount?: number;
  score: number;
}

export function useNeynarUser(context?: { user?: { fid?: number } }) {
  const [user, setUser] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!context?.user?.fid) {
      setUser(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/users?fids=${context.user.fid}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data.users?.[0]) {
          setUser(data.users[0]);
        } else {
          // Create a mock user if API doesn't return data
          setUser({
            fid: context.user!.fid!,
            username: `user${context.user!.fid}`,
            displayName: `User ${context.user!.fid}`,
            score: 0,
          });
        }
      })
      .catch((err) => {
        setError(err.message);
        // Create a mock user on error
        setUser({
          fid: context.user!.fid!,
          username: `user${context.user!.fid}`,
          displayName: `User ${context.user!.fid}`,
          score: 0,
        });
      })
      .finally(() => setLoading(false));
  }, [context?.user?.fid]);

  return { user, loading, error };
} 