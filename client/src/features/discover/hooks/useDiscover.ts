import { useQuery } from '@tanstack/react-query';
import { dicoverAPI } from '../api/DiscoverShow';
import { useMemo } from 'react';

export const useDiscover = () => {
  // 1. Fetch Trending
  const trendingQuery = useQuery({
    queryKey: ['discover', 'trending'],
    queryFn: () => dicoverAPI('trending', 1),
    staleTime: 60000,
  });

  // 2. Fetch Movies
  const moviesQuery = useQuery({
    queryKey: ['discover', 'movies'],
    queryFn: () => dicoverAPI('movies', 1),
    staleTime: 60000,
  });

  // 3. Fetch Anime
  const animeQuery = useQuery({
    queryKey: ['discover', 'anime'],
    queryFn: () => dicoverAPI('anime', 1),
    staleTime: 60000,
  });

  // 4. Fetch Series
  const seriesQuery = useQuery({
    queryKey: ['discover', 'series'],
    queryFn: () => dicoverAPI('series', 1),
    staleTime: 60000,
  });

  // Combined Loading State: true if any of the queries are loading
  const isPending =
    trendingQuery.isPending ||
    moviesQuery.isPending ||
    animeQuery.isPending ||
    seriesQuery.isPending;

  // Memoize random hero selection from trending lists
  const heroShow = useMemo(() => {
    const trendingList = trendingQuery.data?.data || [];
    if (!trendingList.length) return null;
    return trendingList[Math.floor(Math.random() * trendingList.length)];
  }, [trendingQuery.data]);

  return {
    isPending,
    heroShow,
    trendingShows: trendingQuery.data?.data || [],
    trendingMovies: moviesQuery.data?.data || [],
    trendingAnime: animeQuery.data?.data || [],
    trendingSeries: seriesQuery.data?.data || [],
  };
};
