import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { AppHeader } from '../../src/components/layout/AppHeader';
import { UserAvatar } from '../../src/components/ui/UserAvatar';
import { AvatarPickerModal } from '../../src/components/profile/AvatarPickerModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, switchRole, logout, updateUserAvatar } = useAuth();
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleAvatarChange = (newAvatar: string) => {
    updateUserAvatar(newAvatar);
    Alert.alert(
      'Foto Actualizada',
      'Tu foto de perfil se ha guardado exitosamente y ya es visible en toda la aplicación.',
      [{ text: 'Excelente' }]
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader showGreeting={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar interactivo con botón de edición */}
          <UserAvatar
            avatar={user?.avatar}
            name={user?.name}
            role={role}
            size={86}
            borderRadius={28}
            showEditBadge={true}
            onPress={() => setPickerVisible(true)}
          />

          <Pressable
            style={({ pressed }) => [
              styles.changePhotoBtn,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setPickerVisible(true)}
            hitSlop={8}
          >
            <Ionicons name="camera-outline" size={14} color="#2563EB" />
            <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
          </Pressable>

          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>

          {/* Role Pill */}
          <View
            style={[
              styles.roleBadge,
              role === 'CLIENT' ? styles.roleBadgeClient : styles.roleBadgeProvider,
            ]}
          >
            <Ionicons
              name={role === 'CLIENT' ? 'person' : 'briefcase'}
              size={12}
              color={role === 'CLIENT' ? '#2563EB' : '#D97706'}
            />
            <Text
              style={[
                styles.roleBadgeText,
                { color: role === 'CLIENT' ? '#1D4ED8' : '#B45309' },
              ]}
            >
              {role === 'CLIENT' ? 'CLIENTE SOLICITANTE' : 'PRESTADOR DE SERVICIOS'}
            </Text>
          </View>

          {/* Metadata Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>CIUDAD</Text>
              <View style={styles.metaValueRow}>
                <Ionicons name="location-sharp" size={12} color="#EF4444" />
                <Text style={styles.metaValue}>Riohacha</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>TELÉFONO</Text>
              <Text style={styles.metaValue}>{user?.phone || '+57 300 000 0000'}</Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>ESTADO</Text>
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text style={styles.verifiedText}>Activo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Role Switcher Card */}
        <View style={styles.switchCard}>
          <View style={styles.switchHeader}>
            <View style={styles.switchIconBox}>
              <Ionicons name="swap-horizontal" size={18} color="#2563EB" />
            </View>
            <View style={styles.switchHeaderText}>
              <Text style={styles.switchTitle}>Alternar Rol en Tiempo Real</Text>
              <Text style={styles.switchSubtitle}>Evaluación de doble perfil</Text>
            </View>
          </View>

          <Text style={styles.switchDesc}>
            Para la sustentación del parcial, puedes cambiar al instante entre la vista de
            Cliente y la de Prestador sin necesidad de reiniciar sesión.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.switchButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={switchRole}
          >
            <LinearGradient
              colors={
                role === 'CLIENT'
                  ? ['#0F172A', '#1E293B']
                  : ['#2563EB', '#4F46E5']
              }
              style={styles.switchGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="repeat" size={15} color="#FFFFFF" />
              <Text style={styles.switchButtonText}>
                {role === 'CLIENT'
                  ? 'Cambiar a Modo PRESTADOR'
                  : 'Cambiar a Modo CLIENTE'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Academic Project Info Card */}
        <View style={styles.academicCard}>
          <Text style={styles.academicTitle}>Información del Proyecto</Text>

          <View style={styles.academicRow}>
            <Text style={styles.academicLabel}>Estudiante:</Text>
            <Text style={styles.academicValue}>Juan Carlos Añez Ahumada</Text>
          </View>

          <View style={styles.academicRow}>
            <Text style={styles.academicLabel}>Materia:</Text>
            <Text style={styles.academicValue}>Desarrollo Móvil Grupo B1</Text>
          </View>

          <View style={styles.academicRow}>
            <Text style={styles.academicLabel}>Universidad:</Text>
            <Text style={styles.academicValue}>Universidad de La Guajira</Text>
          </View>

          <View style={styles.academicRow}>
            <Text style={styles.academicLabel}>Plataforma:</Text>
            <Text style={styles.academicValue}>Expo SDK 57 • React Native • TS</Text>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={16} color="#E11D48" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>

      {/* Modal selector de foto y avatar */}
      <AvatarPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        currentAvatar={user?.avatar || ''}
        role={role}
        onSelectAvatar={handleAvatarChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    marginTop: 10,
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    borderWidth: 1,
    marginBottom: 18,
  },
  roleBadgeClient: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  roleBadgeProvider: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },

  /* ROLE SWITCH CARD */
  switchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  switchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchHeaderText: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  switchSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  switchDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  switchButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  switchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    gap: 8,
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ACADEMIC CARD */
  academicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  academicTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  academicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  academicLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  academicValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* LOGOUT BUTTON */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    height: 46,
    borderRadius: 14,
    gap: 8,
    marginTop: 4,
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
