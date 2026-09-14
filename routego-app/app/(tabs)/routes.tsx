import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Radius } from '@/constants/colors';
import { SearchInput } from '@/components/ui/SearchInput';
import { RouteFilterPills, RouteFilterType } from '@/features/routes/components/RouteFilterPills';
import { RouteCard } from '@/features/routes/components/RouteCard';
import { RouteDetailModal } from '@/features/routes/components/RouteDetailModal';
import { MOCK_ROUTES } from '@/features/routes/routesData';
import { ShuttleRoute } from '@/features/routes/types';

export default function RoutesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<RouteFilterType>('todas');
  const [favoriteRouteIds, setFavoriteRouteIds] = useState<string[]>(['R-01']);
  const [selectedRoute, setSelectedRoute] = useState<ShuttleRoute | null>(null);

  const toggleFavorite = (routeId: string) => {
    setFavoriteRouteIds((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    );
  };

  // Filter and search logic
  const filteredRoutes = useMemo(() => {
    return MOCK_ROUTES.filter((route) => {
      // Filter by category
      if (selectedFilter === 'activas' && route.status !== 'Activo') return false;
      if (selectedFilter === 'demoradas' && route.status !== 'Demorado') return false;
      if (selectedFilter === 'favoritas' && !favoriteRouteIds.includes(route.id)) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = route.name.toLowerCase().includes(query);
        const matchesCode = route.code.toLowerCase().includes(query);
        const matchesDest = route.destination.toLowerCase().includes(query);
        const matchesOrigin = route.origin.toLowerCase().includes(query);
        const matchesStop = route.stops.some((s) => s.name.toLowerCase().includes(query));

        return matchesName || matchesCode || matchesDest || matchesOrigin || matchesStop;
      }

      return true;
    });
  }, [searchQuery, selectedFilter, favoriteRouteIds]);

  const counts = useMemo(() => {
    return {
      todas: MOCK_ROUTES.length,
      activas: MOCK_ROUTES.filter((r) => r.status === 'Activo').length,
      demoradas: MOCK_ROUTES.filter((r) => r.status === 'Demorado').length,
      favoritas: favoriteRouteIds.length,
    };
  }, [favoriteRouteIds]);

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.title}>Rutas Universitarias</Text>
            <Text style={styles.subtitle}>
              {counts.activas} rutas activas con seguimiento en vivo
            </Text>
          </View>

          <View style={styles.headerIconBox}>
            <Ionicons name="bus" size={20} color={AppColors.primary} />
          </View>
        </View>

        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar por ruta, parada o destino..."
        />
      </View>

      {/* Filter Pills */}
      <RouteFilterPills
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        counts={counts}
      />

      {/* Routes List */}
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RouteCard
            route={item}
            isFavorite={favoriteRouteIds.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onSelectRoute={(route) => setSelectedRoute(route)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={AppColors.textMuted} />
            <Text style={styles.emptyTitle}>No se encontraron rutas</Text>
            <Text style={styles.emptyText}>
              No hay recorridos que coincidan con &quot;{searchQuery}&quot; en la categoría seleccionada.
            </Text>
            <Pressable
              style={styles.clearSearchBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedFilter('todas');
              }}
            >
              <Text style={styles.clearSearchText}>Restablecer filtros</Text>
            </Pressable>
          </View>
        }
      />

      {/* Route Detail Sheet */}
      <RouteDetailModal
        route={selectedRoute}
        visible={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
        isFavorite={selectedRoute ? favoriteRouteIds.includes(selectedRoute.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
    gap: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.text,
  },
  subtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  clearSearchBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  clearSearchText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
