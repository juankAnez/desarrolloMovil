// app/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { syncProducts } from '@/services/sync';
import { useAutoSync } from '@/hooks/useAutoSync';
import { Product } from '@/db/schema';
import { Ionicons } from '@expo/vector-icons';

export default function InventoryScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const {
    products,
    allProducts,
    totals,
    searchQuery,
    setSearchQuery,
    isPending,
    deleteProduct,
  } = useProducts();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Sincronización automática al recuperar la conexión (Punto Extra)
  useAutoSync((msg) => {
    setSyncMessage({
      text: `Sincronización automática: ${msg}`,
      isError: false,
    });
  });

  // Función del botón Sincronizar
  const handleSync = async () => {
    if (!user) return;
    setSyncing(true);
    setSyncMessage(null);

    try {
      const result = await syncProducts(user.id);
      if (result.success) {
        setSyncMessage({
          text: `Sincronización exitosa: ${result.message}`,
          isError: false,
        });
      } else {
        setSyncMessage({
          text: result.message || 'Error de conexión con Supabase',
          isError: true,
        });
      }
    } catch (err: any) {
      setSyncMessage({
        text: `Error de sincronización: ${err?.message || 'Fallo de red'}`,
        isError: true,
      });
    } finally {
      setSyncing(false);
    }
  };

  // Confirmación al eliminar (requerimiento explícito por long-press)
  const confirmDelete = (product: Product) => {
    const message = `¿Deseas eliminar "${product.name}" del inventario?`;

    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        deleteProduct(product.id);
      }
      return;
    }

    Alert.alert('Confirmar Eliminación', message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteProduct(product.id),
      },
    ]);
  };

  const handleSignOut = () => {
    const doLogout = async () => {
      await signOut();
      router.replace('/login');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Deseas cerrar tu sesión?')) {
        doLogout();
      }
      return;
    }

    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: doLogout },
    ]);
  };

  // Formateador de moneda en pesos colombianos sin decimales
  const formatCOP = (val: number) => {
    return '$ ' + Math.floor(val).toLocaleString('es-CO');
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const pending = isPending(item);
    const subtotal = item.quantity * item.price;

    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.85}
        onPress={() => router.push(`/producto?id=${item.id}`)}
        onLongPress={() => confirmDelete(item)}
      >
        <View style={styles.cardMain}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>

            {/* Indicador de si ya está en la nube o pendiente (Requisito clave) */}
            <View
              style={[
                styles.syncBadge,
                pending ? styles.syncBadgePending : styles.syncBadgeCloud,
              ]}
            >
              <Ionicons
                name={pending ? 'cloud-upload-outline' : 'cloud-done-outline'}
                size={13}
                color={pending ? '#D97706' : '#059669'}
              />
              <Text
                style={[
                  styles.syncBadgeText,
                  pending
                    ? styles.syncBadgeTextPending
                    : styles.syncBadgeTextCloud,
                ]}
              >
                {pending ? 'Pendiente' : 'En la nube'}
              </Text>
            </View>
          </View>

          <View style={styles.productDetailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Existencias</Text>
              <Text style={styles.detailValue}>{item.quantity} unds</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Precio unitario</Text>
              <Text style={styles.detailValue}>{formatCOP(item.price)}</Text>
            </View>

            <View style={styles.detailItemRight}>
              <Text style={styles.detailLabel}>Valor total</Text>
              <Text style={styles.subtotalValue}>{formatCOP(subtotal)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() => confirmDelete(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header superior */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Ionicons name="storefront" size={24} color="#2563EB" />
            <Text style={styles.appName}>Mi Tienda</Text>
          </View>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email || 'Tendero'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={syncing} onRefresh={handleSync} />
        }
        ListHeaderComponent={
          <>
            {/* Mensaje de resultado de sincronización */}
            {syncMessage ? (
              <View
                style={[
                  styles.messageBanner,
                  syncMessage.isError
                    ? styles.messageBannerError
                    : styles.messageBannerSuccess,
                ]}
              >
                <Ionicons
                  name={
                    syncMessage.isError
                      ? 'alert-circle-outline'
                      : 'checkmark-circle-outline'
                  }
                  size={18}
                  color={syncMessage.isError ? '#DC2626' : '#059669'}
                />
                <Text
                  style={[
                    styles.messageBannerText,
                    syncMessage.isError
                      ? styles.messageTextError
                      : styles.messageTextSuccess,
                  ]}
                >
                  {syncMessage.text}
                </Text>
              </View>
            ) : null}

            {/* Tarjetas de Totales y Resumen */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCardPrimary}>
                <Text style={styles.summaryCardLabel}>VALOR TOTAL INVENTARIO</Text>
                <Text style={styles.summaryCardBigValue}>
                  {formatCOP(totals.totalValue)}
                </Text>
                <Text style={styles.summaryCardSubtext}>
                  {totals.totalUnits} unidades registradas en {allProducts.length} productos
                </Text>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricCard}>
                  <Ionicons name="layers-outline" size={20} color="#2563EB" />
                  <Text style={styles.metricNumber}>{totals.totalUnits}</Text>
                  <Text style={styles.metricLabel}>Total Unidades</Text>
                </View>

                <View style={styles.metricCard}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={totals.pendingCount > 0 ? '#D97706' : '#10B981'}
                  />
                  <Text
                    style={[
                      styles.metricNumber,
                      totals.pendingCount > 0 && { color: '#D97706' },
                    ]}
                  >
                    {totals.pendingCount}
                  </Text>
                  <Text style={styles.metricLabel}>Pendientes Subir</Text>
                </View>
              </View>
            </View>

            {/* Botón Sincronizar */}
            <TouchableOpacity
              style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
              onPress={handleSync}
              disabled={syncing}
              activeOpacity={0.8}
            >
              {syncing ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.syncButtonText}>Sincronizando con Supabase...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="sync" size={20} color="#FFFFFF" />
                  <Text style={styles.syncButtonText}>
                    Sincronizar {totals.pendingCount > 0 ? `(${totals.pendingCount} pendientes)` : 'con la Nube'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Barra de Búsqueda (Punto Extra) */}
            <View style={styles.searchWrapper}>
              <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar producto por nombre..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Título de la lista */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Inventario Local ({products.length})
              </Text>
              <Text style={styles.sectionSubtitle}>
                Mantén presionado para eliminar
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={54} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Sin coincidencias' : 'No hay productos todavía'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? `No se encontraron productos con el término "${searchQuery}".`
                : 'Toca el botón "+ Agregar Producto" para registrar el primer artículo.'}
            </Text>
          </View>
        }
      />

      {/* Botón flotante para Agregar Producto */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/producto')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
        <Text style={styles.fabText}>Agregar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 220,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  messageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  messageBannerSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  messageBannerError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  messageBannerText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  messageTextSuccess: {
    color: '#047857',
  },
  messageTextError: {
    color: '#DC2626',
  },
  summaryContainer: {
    marginBottom: 14,
  },
  summaryCardPrimary: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },
  summaryCardLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  summaryCardBigValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 4,
  },
  summaryCardSubtext: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  syncButton: {
    backgroundColor: '#059669',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  syncButtonDisabled: {
    backgroundColor: '#6EE7B7',
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardMain: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  syncBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  syncBadgeCloud: {
    backgroundColor: '#D1FAE5',
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  syncBadgeTextPending: {
    color: '#B45309',
  },
  syncBadgeTextCloud: {
    color: '#065F46',
  },
  productDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  subtotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 2,
  },
  cardActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 6,
  },
  deleteIconButton: {
    padding: 6,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    gap: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
