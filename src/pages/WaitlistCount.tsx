import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

interface WaitlistEntry {
  email: string;
  waitlistRole: string | null;
  firstName: string | null;
  lastName: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface WaitlistCountResponse {
  count: number;
  waitlist: WaitlistEntry[];
  pagination: PaginationInfo;
}

export default function WaitlistCount() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const PAGE_SIZE = 10;
  const [count, setCount] = useState<number | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setPasswordError('Please enter a password.');
      return;
    }
    // Accept any non-empty password (can be replaced with a fixed check if needed)
    setIsUnlocked(true);
  };

  useEffect(() => {
    if (!isUnlocked) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/waitlist-count?${params}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch waitlist count');
        }

        const data: WaitlistCountResponse = await res.json();
        setCount(data.count);
        setWaitlist(data.waitlist ?? []);
        setPagination(data.pagination ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isUnlocked, page]);

  // Password gate: show prompt until user submits a password
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Waitlist dashboard
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the password to view waitlist data.
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              autoFocus
              autoComplete="current-password"
            />
            {passwordError && (
              <p className="text-sm text-red-600" role="alert">
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 bg-gray-50">
      {loading && <div className="text-lg text-gray-600">Loading...</div>}
      {error && (
        <div className="text-red-600 font-medium" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && count !== null && (
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
              Waitlist signups
            </p>
            <div className="text-6xl md:text-7xl font-bold text-gray-900">
              {count}
            </div>
          </div>

          {waitlist.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                      >
                        First name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                      >
                        Last name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                      >
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {waitlist.map((entry, index) => (
                      <tr
                        key={`${entry.email}-${entry.waitlistRole ?? ''}-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {entry.email}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {entry.firstName ?? '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {entry.lastName ?? '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 capitalize">
                            {entry.waitlistRole ?? '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

              {pagination && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-600">
                    Page{' '}
                    <span className="font-medium">{pagination.page}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span>
                    {' · '}
                    <span className="font-medium">{pagination.totalCount}</span>{' '}
                    total entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.page <= 1 || loading}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(pagination.totalPages, p + 1)
                        )
                      }
                      disabled={
                        pagination.page >= pagination.totalPages || loading
                      }
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && waitlist.length === 0 && count !== null && count > 0 && (
            <p className="text-center text-sm text-gray-500">
              No waitlist entries to display.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
