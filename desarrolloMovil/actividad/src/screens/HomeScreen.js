// HomeScreen PRO - Maquetación con NativeWind (Tailwind CSS) y componentes Core
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HabitCard from '../components/HabitCard';
import ProgressBar from '../components/ProgressBar';

const FILTERS = ['Todos', 'Hoy', 'Completados', 'Pendientes'];

const HomeScreen = ({ userName = 'Juan', onCreateHabitPress, onLogout }) => {
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

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
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View className="px-5 pt-4 pb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {/* Image 1: Avatar del Usuario (URL remota) */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' }}
              className="w-12 h-12 rounded-2xl border-2 border-indigo-500 shadow-sm"
            />
            <View>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-base font-extrabold text-slate-800 tracking-tight">Hola, {userName}</Text>
                <MaterialCommunityIcons name="hand-wave" size={16} color="#f59e0b" />
                <View className="bg-emerald-100 px-2 py-0.5 rounded-full ml-1 border border-emerald-200">
                  <Text className="text-[10px] font-extrabold text-emerald-700 tracking-wider">PRO</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-500 font-medium mt-0.5">
                {dayName.charAt(0).toUpperCase() + dayName.slice(1)} • {dayNumber} {monthName}
              </Text>
            </View>
          </View>

          {/* Acciones de Cabecera (Pressables con respuesta de opacidad/escala) */}
          <View className="flex-row gap-2">
            <Pressable className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-slate-200 active:opacity-70 active:scale-95 shadow-sm">
              <MaterialCommunityIcons name="bell-outline" size={18} color="#64748b" />
              <View className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
            </Pressable>

            {onLogout && (
              <Pressable
                onPress={onLogout}
                className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center border border-rose-200 active:opacity-70 active:scale-95 shadow-sm"
              >
                <MaterialCommunityIcons name="logout" size={18} color="#ef4444" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Componente Obligatorio: TextInput Funcional (Barra de Búsqueda) */}
        <View className="px-5 my-2">
          <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-3.5 h-12 shadow-sm">
            <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" className="mr-2" />
            <TextInput
              placeholder="Buscar hábito o actividad..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-sm font-semibold text-slate-800"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} className="active:opacity-70">
                <MaterialCommunityIcons name="close-circle" size={18} color="#94a3b8" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Hero Progress Banner - Image 2: Banner Remoto de Fondo */}
        <View className="px-5 my-2">
          <View className="rounded-3xl overflow-hidden shadow-lg relative">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80' }}
              className="w-full h-44 absolute inset-0 opacity-40"
              resizeMode="cover"
            />
            <LinearGradient
              colors={['#6366f1', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-5 rounded-3xl opacity-95"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="bg-white/20 self-start px-3 py-1 rounded-full border border-white/30 flex-row items-center gap-1.5">
                    <MaterialCommunityIcons name="fire" size={12} color="#fff" />
                    <Text className="color-white text-[11px] font-extrabold tracking-wider">RACHA • 7 DÍAS</Text>
                  </View>
                  <Text className="text-white text-2xl font-black mt-3 tracking-tight">Tu progreso de hoy</Text>
                  <Text className="text-indigo-100 text-xs mt-1 leading-relaxed">¡Vas muy bien! Completa tus metas diarias.</Text>
                </View>
                <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center border border-white/30">
                  <Text className="text-2xl font-black text-white">{Math.round(todayProgress * 100)}%</Text>
                </View>
              </View>

              <View className="mt-4 bg-white/20 rounded-full p-1 border border-white/20">
                <ProgressBar progress={todayProgress} height={8} backgroundColor="rgba(255,255,255,0.25)" progressColor="#fff" useGradient={false} />
              </View>

              <View className="flex-row justify-between items-center mt-3">
                <View className="flex-row items-center gap-1.5">
                  <View className="w-5 h-5 rounded-full bg-white items-center justify-center">
                    <MaterialCommunityIcons name="check" size={12} color="#10b981" />
                  </View>
                  <Text className="text-white text-xs font-bold">{completedHabits} completados</Text>
                </View>
                <Text className="text-indigo-100 text-xs font-medium">{totalHabits - completedHabits} pendientes</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View className="px-5 flex-row gap-3 my-2">
          {[
            { label: 'Semana', value: '86%', icon: 'trending-up', color: '#10b981', bg: 'bg-emerald-50' },
            { label: 'Objetivo', value: '12/15', icon: 'target', color: '#6366f1', bg: 'bg-indigo-50' },
            { label: 'Nivel', value: '12', icon: 'trophy-outline', color: '#f59e0b', bg: 'bg-amber-50' },
          ].map((s) => (
            <View key={s.label} className="flex-1 bg-white rounded-2xl p-3 border border-slate-200 items-center shadow-sm">
              <View className={`w-9 h-9 rounded-xl ${s.bg} items-center justify-center mb-2`}>
                <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
              </View>
              <Text className="text-base font-black text-slate-800 tracking-tight">{s.value}</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <View className="px-5 mt-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-extrabold text-slate-800 tracking-tight">Mis hábitos</Text>
            <Pressable className="flex-row items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 active:opacity-70">
              <MaterialCommunityIcons name="swap-vertical" size={14} color="#64748b" />
              <Text className="text-xs font-bold text-slate-600">Ordenar</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full border active:scale-95 ${
                    active ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-600'}`}>{f}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Habit List */}
        <View className="px-5 py-4">
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
            <View className="items-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 my-2">
              <MaterialCommunityIcons name="inbox-outline" size={32} color="#94a3b8" />
              <Text className="text-xs font-bold text-slate-500 mt-2">No se encontraron hábitos</Text>
            </View>
          )}

          {/* CTA Crear Hábito (Pressable 3 obligatorio) */}
          <Pressable
            onPress={onCreateHabitPress}
            className="mt-4 rounded-2xl overflow-hidden active:opacity-90 active:scale-[0.98] shadow-md"
          >
            <LinearGradient colors={['#6366f1', '#7c3aed']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="flex-row items-center justify-center py-4 gap-2">
              <View className="w-6 h-6 rounded-full bg-white/20 items-center justify-center border border-white/30">
                <MaterialCommunityIcons name="plus" size={16} color="#fff" />
              </View>
              <Text className="text-white font-extrabold text-base">Crear nuevo hábito</Text>
            </LinearGradient>
          </Pressable>

          <View className="flex-row justify-center gap-1.5 mt-4 items-center mb-6">
            <MaterialCommunityIcons name="lightbulb-outline" size={14} color="#f59e0b" />
            <Text className="text-xs text-slate-500 font-medium">Tip: filtra o busca arriba tus tareas del día</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
