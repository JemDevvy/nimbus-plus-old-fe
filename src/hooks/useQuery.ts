import { useQuery as useTanstackQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

// Re-export tanstack's useQuery for consistency
export function useQuery<TData = unknown, TError = unknown>(
  options: UseQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  return useTanstackQuery(options);
}
