import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MovieApi } from '../api/MovieAPI';

export const useMovie = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ['movies', 'infinite'],
    // Pass the pageParam context (defaults to initialPageParam = 1)
    queryFn: ({ pageParam = 1 }) => MovieApi(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Each page returns 20 results. If the last page has less than 20, we reached the end.
      const hasMore = lastPage?.data?.length === 20;
      return hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 60000,
  });

  const movies = data ? data.pages.flatMap((page) => page.data || []) : [];

  return {
    movies,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};
