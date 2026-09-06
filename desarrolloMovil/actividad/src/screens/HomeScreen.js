// HomeScreen PRO - Maquetación NativeWind compacta y 100% responsiva
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HabitCard from '../components/HabitCard';
import ProgressBar from '../components/ProgressBar';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const FILTERS = ['Todos', 'Hoy', 'Completados', 'Pendientes'];

const HomeScreen = ({ userName = 'Juan', onCreateHabitPress, onLogout }) => {
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const initialLetter = userName ? userName.trim().charAt(0).toUpperCase() : 'U';

  const habitsList = [
    { id: 1, icon: 'book-open-page-variant-outline', name: 'Estudiar React Native', goal: '1 hora', category: 'Estudio', progress: null, isCompleted: true, streak: 5 },
    { id: 2, icon: 'water-outline', name: 'Beber agua', goal: '8 vasos', category: 'Hidratación', progress: { current: 6, total: 8 }, isCompleted: false, streak: 12 },
    { id: 3, icon: 'library-shelves', name: 'Leer Hábitos Atómicos', goal: '30 min', category: 'Lectura', progress: { current: 20, total: 30 }, isCompleted: false, streak: 3 },
    { id: 4, icon: 'dumbbell', name: 'Entrenar fuerza', goal: '45 min', category: 'Ejercicio', progress: { current: 45, total: 45 }, isCompleted: true, streak: 8 },
  ];

  const filtered = habitsList.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
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
    <SafeAreaView className="flex-1 bg-slate-50" style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView className="flex-1" style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View className="px-5 pt-4 pb-3 flex-row items-center justify-between" style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View className="flex-row items-center gap-3" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Avatar Remoto + Inicial */}
            <View style={{ width: 46, height: 46, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary + '25', ...shadows.xs }}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' }}
                className="w-full h-full"
                style={{ width: 46, height: 46 }}
              />
            </View>
            <View>
              <View className="flex-row items-center gap-1.5" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text className="text-base font-extrabold text-slate-800" style={{ fontSize: 15, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>Hola, {userName}</Text>
                <MaterialCommunityIcons name="hand-wave" size={16} color={colors.warning} />
                <View className="bg-emerald-100 px-2 py-0.5 rounded-full ml-1" style={{ backgroundColor: colors.successLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 }}>
                  <Text className="text-[10px] font-extrabold text-emerald-700" style={{ fontSize: 9, fontWeight: '800', color: colors.success, letterSpacing: 0.5 }}>PRO</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-500 font-medium" style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>
                {dayName.charAt(0).toUpperCase() + dayName.slice(1)} • {dayNumber} {monthName}
              </Text>
            </View>
          </View>

          {/* Acciones de Cabecera */}
          <View className="flex-row gap-2" style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-slate-200 active:opacity-70" style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.backgroundLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs }}>
              <MaterialCommunityIcons name="bell-outline" size={18} color={colors.textSecondary} />
              <View className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white" style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error, borderWidth: 1.5, borderColor: '#fff' }} />
            </Pressable>

            {onLogout && (
              <Pressable
                onPress={onLogout}
                className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center border border-rose-200 active:opacity-70 active:scale-95"
                style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FCA5A5', ...shadows.xs }}
              >
                <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
              </Pressable>
            )}
          </View>
        </View>

        {/* TextInput Funcional (Barra de Búsqueda) */}
        <View className="px-5 my-1" style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>
          <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-3.5 h-11" style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.borderLight, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 46, ...shadows.xs }}>
            <MaterialCommunityIcons name="magnify" size={18} color={colors.textTertiary} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Buscar hábito o actividad..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-sm font-semibold text-slate-800"
              style={{ flex: 1, fontSize: 13, color: colors.text, fontWeight: '500' }}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} className="active:opacity-70">
                <MaterialCommunityIcons name="close-circle" size={16} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Hero Progress Banner - Image Remota 2 (Banner) */}
        <View className="px-5 my-2" style={{ paddingHorizontal: spacing.lg }}>
          <View className="rounded-3xl overflow-hidden relative" style={{ borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.glow }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80' }}
              className="w-full h-full absolute inset-0 opacity-30"
              style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.3 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['#6366f1', '#8b5cf6', '#a855f7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: spacing.lg }}
            >
              <View className="flex-row justify-between items-start" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View className="flex-1" style={{ flex: 1 }}>
                  <View className="bg-white/20 self-start px-3 py-1 rounded-full border border-white/30 flex-row items-center gap-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialCommunityIcons name="fire" size={12} color="#fff" />
                    <Text className="color-white text-[11px] font-extrabold" style={{ color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 }}>RACHA • 7 DÍAS</Text>
                  </View>
                  <Text className="text-white text-2xl font-black mt-3" style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: spacing.md, letterSpacing: -0.6, lineHeight: 26 }}>Tu progreso de hoy</Text>
                  <Text className="text-indigo-100 text-xs mt-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4, lineHeight: 18 }}>¡Vas muy bien! Te falta poco para completar tu día perfecto.</Text>
                </View>
                <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center border border-white/30" style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
                  <Text className="text-2xl font-black text-white" style={{ fontSize: 26, fontWeight: '900', color: '#fff' }}>{Math.round(todayProgress * 100)}%</Text>
                </View>
              </View>

              <View className="mt-4 bg-white/20 rounded-full p-1 border border-white/20" style={{ marginTop: spacing.lg, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: borderRadius.full, padding: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}>
                <ProgressBar progress={todayProgress} height={8} backgroundColor="rgba(255,255,255,0.25)" progressColor="#fff" useGradient={false} />
              </View>

              <View className="flex-row justify-between items-center mt-3" style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
                <View className="flex-row items-center gap-1.5" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View className="w-5 h-5 rounded-full bg-white items-center justify-center" style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="check" size={12} color={colors.success} />
                  </View>
                  <Text className="text-white text-xs font-bold" style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{completedHabits} completados</Text>
                </View>
                <Text className="text-indigo-100 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600' }}>{totalHabits - completedHabits} pendientes • {totalHabits} hábitos</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View className="px-5 flex-row gap-3 my-2" style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, paddingHorizontal: spacing.lg }}>
          {[
            { label: 'Semana', value: '86%', icon: 'trending-up', color: colors.success, bg: colors.successLight },
            { label: 'Objetivo', value: '12/15', icon: 'target', color: colors.primary, bg: colors.primaryMuted },
            { label: 'Nivel', value: '12', icon: 'trophy-outline', color: colors.warning, bg: colors.warningLight },
          ].map((s) => (
            <View key={s.label} className="flex-1 bg-white rounded-2xl p-3 border border-slate-200 items-center shadow-sm" style={{ flex: 1, backgroundColor: colors.backgroundLight, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs, alignItems: 'center' }}>
              <View className="w-9 h-9 rounded-xl items-center justify-center mb-2" style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: s.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <MaterialCommunityIcons name={s.icon} size={16} color={s.color} />
              </View>
              <Text className="text-base font-black text-slate-800" style={{ fontSize: 16, fontWeight: '900', color: colors.text, letterSpacing: -0.3 }}>{s.value}</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginTop: 2, letterSpacing: 0.3 }}>{s.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <View className="px-5 mt-4" style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <View className="flex-row justify-between items-center mb-3" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text className="text-base font-extrabold text-slate-800" style={{ fontSize: 16, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>Mis hábitos</Text>
            <Pressable className="flex-row items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 active:opacity-70" style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.backgroundLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.borderLight }}>
              <MaterialCommunityIcons name="swap-vertical" size={14} color={colors.textSecondary} />
              <Text className="text-xs font-bold text-slate-600" style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary }}>Ordenar</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full border active:scale-95 ${
                    active ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'
                  }`}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                    borderRadius: 999,
                    backgroundColor: active ? colors.text : colors.backgroundLight,
                    borderWidth: 1,
                    borderColor: active ? colors.text : colors.borderLight,
                  }}
                >
                  <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-600'}`} style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : colors.textSecondary }}>{f}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Habit List */}
        <View className="px-5 py-4" style={{ padding: spacing.lg, paddingTop: spacing.md }}>
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
            <View className="items-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 my-2" style={{ alignItems: 'center', paddingVertical: spacing.xl, backgroundColor: colors.backgroundLight, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.borderLight, borderStyle: 'dashed' }}>
              <MaterialCommunityIcons name="inbox-outline" size={32} color={colors.textTertiary} />
              <Text className="text-xs font-bold text-slate-500 mt-2" style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginTop: 8 }}>No hay hábitos en esta vista</Text>
            </View>
          )}

          {/* CTA Crear Hábito (Pressable 3 obligatorio) */}
          <Pressable
            onPress={onCreateHabitPress}
            className="mt-4 rounded-2xl overflow-hidden active:opacity-90 active:scale-[0.98]"
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

          <View className="flex-row justify-center gap-1.5 mt-4 items-center mb-6" style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md, alignItems: 'center' }}>
            <MaterialCommunityIcons name="lightbulb-outline" size={14} color={colors.warning} />
            <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>Tip: mantén presionado un hábito para editarlo</Text>
          </View>

          <View style={{ height: spacing.lg }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
