import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenCreateModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal }) => {
  const { theme, toggleTheme, colors, user, triggerSearchFocus } = useApp();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Logo & Marca */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="layers" size={20} color="#FFFFFF" />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={[styles.brandName, { color: colors.text }]}>TaskFlow</Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>SaaS</Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Gestión React Native
          </Text>
        </View>
      </View>

      {/* Botones de acción derecha */}
      <View style={styles.actionsRow}>
        {/* Disparar búsqueda (demuestra comunicación con useRef en otra vista) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={triggerSearchFocus}
          style={[styles.actionIconButton, { backgroundColor: colors.cardSubtle }]}
          accessibilityLabel="Buscar tareas"
        >
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Alternar Tema Claro / Oscuro */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleTheme}
          style={[styles.actionIconButton, { backgroundColor: colors.cardSubtle }]}
          accessibilityLabel="Cambiar tema"
        >
          <Ionicons
            name={theme === 'dark' ? 'sunny' : 'moon'}
            size={18}
            color={theme === 'dark' ? '#FBBF24' : '#6366F1'}
          />
        </TouchableOpacity>

        {/* Botón rápido Crear Tarea */}
        {onOpenCreateModal && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenCreateModal}
            style={[styles.quickAddBtn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Avatar Usuario */}
        <View style={styles.avatarWrap}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarInitials}>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tagBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrap: {
    marginLeft: 2,
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
