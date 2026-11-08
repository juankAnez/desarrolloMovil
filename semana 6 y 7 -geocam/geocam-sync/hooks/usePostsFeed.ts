// hooks/usePostsFeed.ts
// Consumo del feed de la nube con TanStack Query v5: caché, paginación por cursor, mutaciones y realtime.
import { useEffect, useMemo } from 'react';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { createPost, deletePost, listPostsPage } from '@/services/posts';

export function usePostsFeed(search: string) {
  const query = useInfiniteQuery({
    queryKey: ['posts', { search }], // cada búsqueda tiene su propia entrada en caché
    queryFn: ({ pageParam }) => listPostsPage({ cursor: pageParam, search }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData, // al escribir, se conserva la lista anterior para evitar saltos
  });

  // Aplanamos las páginas en una sola lista para el FlatList
  const posts = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);

  return { ...query, posts };
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}

/** Tiempo real: invalida la caché cuando se inserta o elimina un post en Supabase */
export function usePostsRealtime() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel('muro-posts-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
