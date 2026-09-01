// HomeScreen PRO - Dashboard premium con hero gradient + filtros + stats
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HabitCard from '../components/HabitCard';
import ProgressBar from '../components/ProgressBar';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const FILTERS = ['Todos', 'Hoy', 'Completados', 'Pendientes'];

const HomeScreen = ({ onCreateHabitPress }) => {
  const [filter, setFilter] = useState('Todos');

  const habitsList = [
    { id: 1, icon: 'book-open-page-variant-outline', name: 'Estudiar React Native', goal: '1 hora', category: 'Estudio', progress: null, isCompleted: true, streak: 5 },
    { id: 2, icon: 'water-outline', name: 'Beber agua', goal: '8 vasos', category: 'Hidratación', progress: { current: 6, total: 8 }, isCompleted: false, streak: 12 },
    { id: 3, icon: 'library-shelves', name: 'Leer Hábitos Atómicos', goal: '30 min', category: 'Lectura', progress: { current: 20, total: 30 }, isCompleted: false, streak: 3 },
    { id: 4, icon: 'dumbbell', name: 'Entrenar fuerza', goal: '45 min', category: 'Ejercicio', progress: { current: 45, total: 45 }, isCompleted: true, streak: 8 },
  ];

  const filtered = habitsList.filter((h) => {
    if (filter === 'Completados') return h.isCompleted;
    if (filter === 'Pendientes') return !h.isCompleted;
    return true;
  });

  const completedHabits = habitsList.filter((h) => h.isCompleted).length;
  const totalHabits = habitsList.length;
  const todayProgress = completedHabits / totalHabits;
  const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
  const dayNumber = new Date().getDate();
  const monthName = new Date().toLocaleDateString('es-ES', { month: 'short' });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      {/* Top header */}
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primaryMuted, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '15' }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: colors.primary }}>J</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>Hola, Juan</Text>
              <MaterialCommunityIcons name="hand-wave" size={16} color={colors.warning} />
              <View style={{ backgroundColor: colors.successLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, marginLeft: 4 }}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: colors.success, letterSpacing: 0.5 }}>PRO</Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{dayName.charAt(0).toUpperCase() + dayName.slice(1)} • {dayNumber} {monthName}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.backgroundLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs }}>
            <MaterialCommunityIcons name="magnify" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.backgroundLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs }}>
            <MaterialCommunityIcons name="bell-outline" size={18} color={colors.textSecondary} />
            <View style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error, borderWidth: 1.5, borderColor: '#fff' }} />
          </Pressable>
        </View>
      </View>

      {/* Hero progress card - Gradient */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.glow }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="fire" size={12} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 }}>RACHA • 7 DÍAS</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: spacing.md, letterSpacing: -0.6, lineHeight: 26 }}>Tu progreso de hoy</Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4, lineHeight: 18 }}>¡Vas muy bien! Te falta poco para completar tu día perfecto.</Text>
            </View>
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
              <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff' }}>{Math.round(todayProgress * 100)}%</Text>
            </View>
          </View>

          <View style={{ marginTop: spacing.lg, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: borderRadius.full, padding: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}>
            <ProgressBar progress={todayProgress} height={8} backgroundColor="rgba(255,255,255,0.25)" progressColor="#fff" useGradient={false} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name="check" size={12} color={colors.success} />
              </View>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{completedHabits} completados</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600' }}>{totalHabits - completedHabits} pendientes • {totalHabits} hábitos</Text>
          </View>
        </LinearGradient>

        {/* Quick stats row */}
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
          {[
            { label: 'Semana', value: '86%', icon: 'trending-up', color: colors.success, bg: colors.successLight },
            { label: 'Objetivo', value: '12/15', icon: 'target', color: colors.primary, bg: colors.primaryMuted },
            { label: 'Nivel', value: '12', icon: 'trophy-outline', color: colors.warning, bg: colors.warningLight },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: colors.backgroundLight, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs, alignItems: 'center' }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: s.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <MaterialCommunityIcons name={s.icon} size={16} color={s.color} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text, letterSpacing: -0.3 }}>{s.value}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginTop: 2, letterSpacing: 0.3 }}>{s.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>Mis hábitos</Text>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.backgroundLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.borderLight }}>
            <MaterialCommunityIcons name="swap-vertical" size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary }}>Ordenar</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 999,
                  backgroundColor: active ? colors.text : colors.backgroundLight,
                  borderWidth: 1,
                  borderColor: active ? colors.text : colors.borderLight,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : colors.textSecondary }}>{f}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Habit list */}
      <View style={{ padding: spacing.lg, paddingTop: spacing.md }}>
        {filtered.map((habit) => (
          <HabitCard
            key={habit.id}
            icon={habit.icon}
            name={habit.name}
            goal={habit.goal}
            progress={habit.progress}
            isCompleted={habit.isCompleted}
            category={habit.category}
            streak={habit.streak}
          />
        ))}

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: spacing.xl, backgroundColor: colors.backgroundLight, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.borderLight, borderStyle: 'dashed' }}>
            <MaterialCommunityIcons name="inbox-outline" size={32} color={colors.textTertiary} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginTop: 8 }}>No hay hábitos en esta vista</Text>
          </View>
        )}

        {/* CTA crear */}
        <Pressable
          onPress={onCreateHabitPress}
          style={({ pressed }) => ({
            marginTop: spacing.md,
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            opacity: pressed ? 0.9 : 1,
            ...shadows.glow,
          })}
        >
          <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
              <MaterialCommunityIcons name="plus" size={16} color="#fff" />
            </View>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Crear nuevo hábito</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md, alignItems: 'center' }}>
          <MaterialCommunityIcons name="lightbulb-outline" size={14} color={colors.warning} />
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>Tip: mantén presionado un hábito para editarlo</Text>
        </View>

        <View style={{ height: spacing.lg }} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
