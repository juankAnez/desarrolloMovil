// app/(tabs)/muro.tsx
// Feed de la nube consumido con TanStack Query con manejadores de UI completos.
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { useIsOnline } from '@/lib/queryClient';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  useCreatePost,
  useDeletePost,
  usePostsFeed,
  usePostsRealtime,
} from '@/hooks/usePostsFeed';
import { imageUrl, type Post } from '@/services/posts';

export default function MuroScreen() {
  const { session, signOut } = useAuth();
  const user = session?.user;

  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 350);
  const isOnline = useIsOnline();

  const feed = usePostsFeed(debouncedSearch);
  const createPostMutation = useCreatePost();
  const deletePostMutation = useDeletePost();
  usePostsRealtime();

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar una foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const publish = () => {
    if (!user) return;
    if (!content.trim()) {
      Alert.alert('Publicación vacía', 'Escribe un mensaje para publicar.');
      return;
    }

    createPostMutation.mutate(
      {
        userId: user.id,
        email: user.email ?? 'anónimo',
        content: content.trim(),
        imageUri,
      },
      {
        onSuccess: () => {
          setContent('');
          setImageUri(null);
        },
        onError: (err) => {
          Alert.alert('Error al publicar', err.message);
        },
      }
    );
  };

  const handleDeletePost = (post: Post) => {
    if (post.user_id !== user?.id) return;
    Alert.alert(
      'Eliminar publicación',
      '¿Estás seguro de eliminar esta publicación de la nube?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deletePostMutation.mutate(post),
        },
      ]
    );
  };

  const renderPost = ({ item }: { item: Post }) => {
    const isMine = item.user_id === user?.id;
    return (
      <Pressable
        onLongPress={() => isMine && handleDeletePost(item)}
        className="mx-4 mb-3 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4"
      >
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
              <Ionicons name="person" size={16} color="#10b981" />
            </View>
            <View>
              <Text className="text-xs font-bold text-white">
                {item.author_email} {isMine ? '(Tú)' : ''}
              </Text>
              <Text className="text-[10px] text-neutral-400">
                {new Date(item.created_at).toLocaleString('es-CO')}
              </Text>
            </View>
          </View>
          {isMine && (
            <Pressable
              onPress={() => handleDeletePost(item)}
              hitSlop={8}
              className="p-1"
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </Pressable>
          )}
        </View>

        <Text className="text-sm leading-5 text-neutral-100">{item.content}</Text>

        {item.image_path && (
          <Image
            source={{ uri: imageUrl(item.image_path) }}
            className="mt-3 aspect-video w-full rounded-xl bg-neutral-950"
            resizeMode="cover"
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-neutral-950">
      {/* 1. MANEJADOR DE UI: Banner de estado sin conexión */}
      {!isOnline && (
        <View className="flex-row items-center justify-center gap-2 bg-amber-500/20 px-4 py-2 border-b border-amber-500/40">
          <Ionicons name="cloud-offline-outline" size={16} color="#f59e0b" />
          <Text className="text-xs font-medium text-amber-300">
            Sin conexión. Mostrando datos en caché local de TanStack.
          </Text>
        </View>
      )}

      {/* Cabecera y buscador */}
      <View className="gap-3 px-4 pb-2 pt-1 border-b border-neutral-900">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">Muro Nube</Text>
            <Text className="text-xs text-neutral-400">
              TanStack Query v5 · Paginación por cursor
            </Text>
          </View>
          <Pressable
            onPress={() =>
              Alert.alert('Cerrar sesión', user?.email ?? '', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', style: 'destructive', onPress: () => signOut() },
              ])
            }
            className="h-10 w-10 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Ionicons name="log-out-outline" size={22} color="#a3a3a3" />
          </Pressable>
        </View>

        {/* Campo de búsqueda con Debounce */}
        <View className="flex-row items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2">
          <Ionicons name="search" size={18} color="#737373" />
          <TextInput
            className="flex-1 text-sm text-white"
            placeholder="Buscar publicaciones en la nube..."
            placeholderTextColor="#737373"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#737373" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Compositor para crear posts en la nube */}
      <View className="mx-4 my-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-3.5">
        <TextInput
          className="min-h-[50px] text-sm text-white"
          placeholder="¿Qué estás descubriendo o documentando?"
          placeholderTextColor="#737373"
          value={content}
          onChangeText={setContent}
          maxLength={280}
          multiline
        />

        {imageUri && (
          <View className="relative my-2">
            <Image
              source={{ uri: imageUri }}
              className="h-28 w-28 rounded-lg bg-neutral-800"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => setImageUri(null)}
              className="absolute -top-2 left-24 rounded-full bg-red-600 p-1"
            >
              <Ionicons name="close" size={14} color="#fff" />
            </Pressable>
          </View>
        )}

        <View className="mt-2 flex-row items-center justify-between border-t border-neutral-800/80 pt-2.5">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={takePhoto} className="flex-row items-center gap-1.5 py-1">
              <Ionicons name="camera-outline" size={18} color="#10b981" />
              <Text className="text-xs text-emerald-400">Cámara</Text>
            </Pressable>
            <Pressable onPress={pickImage} className="flex-row items-center gap-1.5 py-1">
              <Ionicons name="image-outline" size={18} color="#10b981" />
              <Text className="text-xs text-emerald-400">Galería</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={publish}
            disabled={createPostMutation.isPending || !content.trim()}
            className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${
              createPostMutation.isPending || !content.trim()
                ? 'bg-neutral-800'
                : 'bg-emerald-500'
            }`}
          >
            {createPostMutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text className="text-xs font-semibold text-neutral-950">Publicar</Text>
                <Ionicons name="paper-plane" size={13} color="#0a0a0a" />
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* 2. MANEJADOR DE UI: Estado de Carga Inicial */}
      {feed.status === 'pending' && feed.fetchStatus === 'fetching' && (
        <View className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="mt-3 text-xs text-neutral-400">
            Cargando feed de la nube...
          </Text>
        </View>
      )}

      {/* 3. MANEJADOR DE UI: Estado Pausado (Sin caché y sin internet en primer intento) */}
      {feed.status === 'pending' && feed.fetchStatus === 'paused' && (
        <View className="flex-1 items-center justify-center p-6 text-center">
          <Ionicons name="cloud-offline" size={44} color="#737373" />
          <Text className="mt-3 text-sm font-semibold text-neutral-200">
            Sin conexión para la carga inicial
          </Text>
          <Text className="mt-1 text-center text-xs text-neutral-400">
            Conéctate a internet para sincronizar por primera vez el feed de la nube.
          </Text>
        </View>
      )}

      {/* 4. MANEJADOR DE UI: Estado de Error con Botón de Reintento */}
      {feed.status === 'error' && (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-full max-w-sm rounded-2xl border border-red-900/60 bg-red-950/30 p-5 items-center">
            <Ionicons name="alert-circle-outline" size={40} color="#ef4444" />
            <Text className="mt-2 text-sm font-semibold text-red-200">
              Error al consultar el feed remoto
            </Text>
            <Text className="mt-1 text-center text-xs text-red-400">
              {feed.error.message}
            </Text>
            <Pressable
              onPress={() => feed.refetch()}
              className="mt-4 flex-row items-center gap-2 rounded-xl bg-red-600 px-4 py-2"
            >
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text className="text-xs font-semibold text-white">Reintentar</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Lista del Feed con Pull-to-Refresh y Scroll Infinito */}
      {feed.status === 'success' && (
        <FlatList
          className="flex-1"
          data={feed.posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPost}
          // 5. MANEJADOR DE UI: Estado Vacío Diferenciado (Búsqueda vs Muro Vacío)
          ListEmptyComponent={
            <View className="items-center justify-center p-8">
              <Ionicons
                name={debouncedSearch ? 'search-outline' : 'chatbubbles-outline'}
                size={40}
                color="#525252"
              />
              <Text className="mt-3 text-center text-sm font-semibold text-neutral-300">
                {debouncedSearch
                  ? 'Sin resultados para la búsqueda'
                  : 'Aún no hay publicaciones en el muro'}
              </Text>
              <Text className="mt-1 text-center text-xs text-neutral-500">
                {debouncedSearch
                  ? `No se encontró nada con "${debouncedSearch}". Prueba con otro término.`
                  : 'Sé el primero en publicar un mensaje en la comunidad.'}
              </Text>
            </View>
          }
          // 6. MANEJADOR DE UI: Pull to Refresh
          refreshControl={
            <RefreshControl
              refreshing={feed.isRefetching && !feed.isFetchingNextPage}
              onRefresh={() => feed.refetch()}
              tintColor="#10b981"
              colors={['#10b981']}
            />
          }
          // 7. MANEJADOR DE UI: Scroll Infinito con Paginación por Cursor
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (feed.hasNextPage && !feed.isFetchingNextPage) {
              feed.fetchNextPage();
            }
          }}
          ListFooterComponent={
            feed.isFetchingNextPage ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#10b981" />
                <Text className="mt-1 text-[11px] text-neutral-400">
                  Cargando más publicaciones…
                </Text>
              </View>
            ) : feed.hasNextPage ? null : feed.posts.length > 0 ? (
              <Text className="py-6 text-center text-[11px] text-neutral-600">
                Has llegado al final del feed
              </Text>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}
