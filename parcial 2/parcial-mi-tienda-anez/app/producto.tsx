// app/producto.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { Ionicons } from '@expo/vector-icons';

export default function ProductoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const { createProduct, updateProduct, deleteProduct, getById } = useProducts();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditing && id) {
      getById(Number(id))
        .then((product) => {
          if (product) {
            setName(product.name);
            setQuantity(String(product.quantity));
            setPrice(String(product.price));
          } else {
            setErrorMessage('El producto solicitado no fue encontrado.');
          }
        })
        .catch((err) => {
          console.error('Error cargando producto:', err);
          setErrorMessage('Error al cargar la información del producto.');
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleSave = async () => {
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('El nombre del producto es obligatorio.');
      return;
    }

    const parsedQty = Number(quantity.trim());
    if (
      quantity.trim() === '' ||
      isNaN(parsedQty) ||
      !Number.isInteger(parsedQty) ||
      parsedQty < 0
    ) {
      setErrorMessage(
        'La cantidad debe ser un número entero mayor o igual a 0.'
      );
      return;
    }

    const parsedPrice = Number(price.trim());
    if (
      price.trim() === '' ||
      isNaN(parsedPrice) ||
      !Number.isInteger(parsedPrice) ||
      parsedPrice < 0
    ) {
      setErrorMessage(
        'El precio debe ser un número entero en pesos mayor o igual a 0 (sin decimales).'
      );
      return;
    }

    setLoading(true);
    try {
      if (isEditing && id) {
        await updateProduct(Number(id), {
          name: trimmedName,
          quantity: parsedQty,
          price: parsedPrice,
        });
      } else {
        await createProduct({
          name: trimmedName,
          quantity: parsedQty,
          price: parsedPrice,
        });
      }

      router.back();
    } catch (err: any) {
      console.error('Error guardando producto:', err);
      setErrorMessage(err?.message || 'Error al guardar el producto localmente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;

    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm(
        `¿Estás seguro de eliminar "${name}" del inventario?`
      );
      if (confirmDelete) {
        deleteProduct(Number(id)).then(() => router.back());
      }
      return;
    }

    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de eliminar "${name}" del inventario?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(Number(id));
              router.back();
            } catch (err) {
              console.error('Error eliminando producto:', err);
            }
          },
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando datos del producto...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Barra superior de navegación del modal */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </Text>
          {isEditing ? (
            <TouchableOpacity
              style={styles.deleteTopButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={22} color="#DC2626" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: isEditing ? '#FEF3C7' : '#EFF6FF' },
              ]}
            >
              <Ionicons
                name={isEditing ? 'create-outline' : 'cube-outline'}
                size={28}
                color={isEditing ? '#D97706' : '#2563EB'}
              />
            </View>
            <Text style={styles.cardTitle}>
              {isEditing
                ? 'Modificar Datos del Artículo'
                : 'Registrar Artículo en Inventario'}
            </Text>
            <Text style={styles.cardSubtitle}>
              Se guardará en la base de datos local SQLite y se marcará pendiente de subir a Supabase.
            </Text>
          </View>

          {/* Mensaje de error / validación visible */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Nombre del producto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nombre del Producto <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej. Arroz Diana 1kg, Aceite 500ml"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
            </View>
          </View>

          {/* Cantidad en existencia */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Cantidad (unidades en existencia) <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="layers-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={quantity}
                onChangeText={(val) => {
                  setQuantity(val);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
            </View>
          </View>

          {/* Precio en pesos */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Precio en pesos (sin decimales) <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 4500"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={price}
                onChangeText={(val) => {
                  setPrice(val);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
              <Text style={styles.currencySuffix}>COP</Text>
            </View>
          </View>

          {/* Botones de acción */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? 'save-outline' : 'add-circle-outline'}
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Actualizar Producto' : 'Guardar en Inventario'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deleteTopButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#DC2626',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 6,
  },
  currencySuffix: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
  },
});
