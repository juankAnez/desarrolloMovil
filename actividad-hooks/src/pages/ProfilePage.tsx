import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskStatistics } from '../types';
import { useApp } from '../context/AppContext';

interface ProfilePageProps {
  statistics: TaskStatistics;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ statistics }) => {
  const { user, theme, toggleTheme, colors, notify } = useApp();

  const HOOKS_INFO = [
    {
      name: 'useState',
      desc: 'Manejo de estado reactivo para tareas, filtros, modales y formularios.',
      icon: 'cube-outline',
    },
    {
      name: 'useEffect',
      desc: 'Simulación de carga de API con retardo (700ms) y auto-enfoque de inputs.',
      icon: 'timer-outline',
    },
    {
      name: 'useContext',
      desc: 'Estado global compartido para el usuario, tema claro/oscuro y notificaciones.',
      icon: 'share-social-outline',
    },
    {
      name: 'useRef',
      desc: 'Auto-enfoque en el TextInput del modal al abrir y buscador de tareas.',
      icon: 'locate-outline',
    },
    {
      name: 'useMemo',
      desc: 'Cálculo de estadísticas KPI, % de avance y filtrado reactivo sin recomputar.',
      icon: 'flash-outline',
    },
    {
      name: 'useCallback',
      desc: 'Memorización de manejadores para evitar re-renderizados en React.memo(TaskCard).',
      icon: 'repeat-outline',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Tarjeta de Perfil de Juan Carlos Áñez */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.userRow}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[styles.avatarFallback, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.avatarInitials}>JA</Text>
            </View>
          )}

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user.name}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Lead</Text>
              </View>
            </View>
            <Text style={[styles.userRole, { color: colors.textSecondary }]}>
              {user.role}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textMuted }]}>
              {user.email}
            </Text>
          </View>
        </View>

        {/* Resumen de actividad */}
        <View
          style={[
            styles.statsRow,
            {
              backgroundColor: colors.cardSubtle,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: colors.primary }]}>
              {statistics.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Asignadas
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: colors.success }]}>
              {statistics.completed}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Completadas
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#8B5CF6' }]}>
              {statistics.completionRate}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Eficiencia
            </Text>
          </View>
        </View>
      </View>

      {/* Ajustes de Preferencias */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferencias de Aplicación
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingTextWrap}>
            <Ionicons
              name={theme === 'dark' ? 'moon' : 'sunny'}
              size={18}
              color={colors.primary}
              style={{ marginRight: 10 }}
            />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Modo Oscuro (Dark Theme)
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                Gestionado globalmente mediante useContext
              </Text>
            </View>
          </View>

          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={theme === 'dark' ? colors.primary : '#F1F5F9'}
            trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
          />
        </View>
      </View>

      {/* Guía Académica de Hooks */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.academicTitleRow}>
          <Ionicons name="ribbon" size={20} color="#4F46E5" />
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
            Demostración Académica de Hooks
          </Text>
        </View>
        <Text style={[styles.academicIntro, { color: colors.textSecondary }]}>
          Esta aplicación implementa los 6 Hooks esenciales de React de manera
          funcional y demostrable:
        </Text>

        <View style={styles.hooksList}>
          {HOOKS_INFO.map((hook, index) => (
            <View
              key={index}
              style={[
                styles.hookItem,
                {
                  backgroundColor: colors.cardSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.hookHeader}>
                <Ionicons
                  name={hook.icon as any}
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.hookName, { color: colors.primary }]}>
                  {hook.name}
                </Text>
              </View>
              <Text style={[styles.hookDesc, { color: colors.textSecondary }]}>
                {hook.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Botón de sesión */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => notify('Sesión sincronizada y guardada', 'info')}
        style={[styles.syncBtn, { borderColor: colors.border }]}
      >
        <Ionicons name="cloud-done-outline" size={18} color={colors.primary} />
        <Text style={[styles.syncBtnText, { color: colors.primary }]}>
          Sincronizar Estado Local
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
  },
  userRole: {
    fontSize: 12,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  academicTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  academicIntro: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  hooksList: {
    gap: 10,
  },
  hookItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  hookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  hookName: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  hookDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  syncBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
