import { useEffect, useState } from 'react';

interface WaitlistCountResponse {
  count: number;
}

export default function WaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/waitlist-count`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch waitlist count');
        }

        const data: WaitlistCountResponse = await res.json();
        setCount(data.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && count !== null && (
        <div className="text-6xl font-bold">{count}</div>
      )}
    </div>
  );
}
