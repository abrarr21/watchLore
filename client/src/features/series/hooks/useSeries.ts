import { useInfiniteQuery } from '@tanstack/react-query';
import { SeriesApi } from '../api/SeriesApi';

export const useSeries = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ['series', 'infinite'],
    queryFn: ({ pageParam = 1 }) => SeriesApi(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage?.data?.length === 20;
      return hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 40000,
  });

  const series = data ? data.pages.flatMap((page) => page.data || []) : [];

  return {
    series,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};
