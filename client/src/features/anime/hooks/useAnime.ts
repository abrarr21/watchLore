import { useInfiniteQuery } from '@tanstack/react-query';
import { AnimeAPI } from '../api/AnimeAPI';

export const useAnime = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ['anime', 'infinite'],
    queryFn: ({ pageParam = 1 }) => AnimeAPI(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage?.data?.length === 20;
      return hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 60000,
  });

  const anime = data ? data.pages.flatMap((page) => page.data || []) : [];

  return {
    anime,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};
