// CreateHabitScreen PRO - Formulario premium seccionado
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows, categoryConfig } from '../styles/theme';

const ICONS = [
  { name: 'book-open-page-variant-outline', label: 'Estudio' },
  { name: 'dumbbell', label: 'Gym' },
  { name: 'water-outline', label: 'Agua' },
  { name: 'meditation', label: 'Meditación' },
  { name: 'run', label: 'Correr' },
  { name: 'food-apple-outline', label: 'Nutrición' },
  { name: 'sleep', label: 'Sueño' },
  { name: 'code-tags', label: 'Código' },
];

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const CreateHabitScreen = () => {
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [category, setCategory] = useState('Estudio');
  const [selectedIcon, setSelectedIcon] = useState('book-open-page-variant-outline');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [frequency, setFrequency] = useState('Diario');
  const [focused, setFocused] = useState(null);

  const handleSaveHabit = () => {
    if (!habitName || !dailyGoal) {
      Alert.alert('Campos requeridos', 'Completa nombre y meta diaria para continuar');
      return;
    }
    Alert.alert('¡Hábito creado! 🎉', `“${habitName}” se añadió a tu lista correctamente`);
    setHabitName(''); setDescription(''); setDailyGoal(''); setCategory('Estudio');
  };

  const categories = Object.keys(categoryConfig);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      {/* Header */}
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary, letterSpacing: 1 }}>NUEVO HÁBITO</Text>
            <Text style={{ fontSize: 26, fontWeight: '900', color: colors.text, letterSpacing: -0.7, marginTop: 2 }}>Crear hábito</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Diseña tu próximo hábito atómico</Text>
          </View>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryMuted, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '15' }}>
            <MaterialCommunityIcons name="sparkles" size={20} color={colors.primary} />
          </View>
        </View>
      </View>

      {/* Preview card */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
        <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textTertiary, letterSpacing: 0.6, marginBottom: spacing.sm }}>VISTA PREVIA</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LinearGradient colors={[selectedColor + '20', selectedColor + '08']} style={{ width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md, borderWidth: 1, borderColor: selectedColor + '20' }}>
              <MaterialCommunityIcons name={selectedIcon} size={22} color={selectedColor} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }} numberOfLines={1}>{habitName || 'Nombre de tu hábito'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={{ backgroundColor: colors.backgroundMuted, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: colors.textSecondary }}>{category.toUpperCase()}</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.textTertiary }}>•</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>{dailyGoal || 'Meta diaria'}</Text>
                <Text style={{ fontSize: 12, color: colors.textTertiary }}>•</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>{frequency}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}>
        {/* Sección 1 - Información básica */}
        <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>1</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>Información básica</Text>
          </View>

          {/* Nombre */}
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 8 }}>NOMBRE DEL HÁBITO *</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: focused === 'name' ? colors.primary : colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, backgroundColor: focused === 'name' ? colors.primaryMuted + '50' : colors.background, height: 52 }}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={focused === 'name' ? colors.primary : colors.textTertiary} style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Ej: Leer 30 minutos"
                placeholderTextColor={colors.textTertiary}
                value={habitName}
                onChangeText={setHabitName}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                style={{ flex: 1, fontSize: 14, color: colors.text, fontWeight: '600' }}
              />
              {habitName.length > 0 && <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />}
            </View>
            <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 6 }}>{habitName.length}/32 caracteres</Text>
          </View>

          {/* Descripción */}
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 8 }}>DESCRIPCIÓN</Text>
            <View style={{ borderWidth: 1.5, borderColor: focused === 'desc' ? colors.primary : colors.border, borderRadius: borderRadius.md, padding: spacing.md, backgroundColor: focused === 'desc' ? colors.primaryMuted + '50' : colors.background, minHeight: 90 }}>
              <TextInput
                placeholder="Ej: Leer un capítulo de mi libro favorito cada noche antes de dormir..."
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                onFocus={() => setFocused('desc')}
                onBlur={() => setFocused(null)}
                style={{ fontSize: 14, color: colors.text, lineHeight: 20, textAlignVertical: 'top', minHeight: 60 }}
              />
            </View>
          </View>

          {/* Meta */}
          <View>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 8 }}>META DIARIA *</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: focused === 'goal' ? colors.primary : colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, backgroundColor: focused === 'goal' ? colors.primaryMuted + '50' : colors.background, height: 52 }}>
              <MaterialCommunityIcons name="target" size={18} color={focused === 'goal' ? colors.primary : colors.textTertiary} style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Ej: 30 minutos / 8 vasos"
                placeholderTextColor={colors.textTertiary}
                value={dailyGoal}
                onChangeText={setDailyGoal}
                onFocus={() => setFocused('goal')}
                onBlur={() => setFocused(null)}
                style={{ flex: 1, fontSize: 14, color: colors.text, fontWeight: '600' }}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              {['30 min', '1 hora', '8 vasos', '5 km'].map((chip) => (
                <Pressable key={chip} onPress={() => setDailyGoal(chip)} style={{ backgroundColor: dailyGoal === chip ? colors.primary : colors.backgroundMuted, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: dailyGoal === chip ? colors.primary : colors.borderLight }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: dailyGoal === chip ? '#fff' : colors.textSecondary }}>{chip}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Sección 2 - Personalización */}
        <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>2</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>Personalización</Text>
          </View>

          {/* Categoría */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 10 }}>CATEGORÍA</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {categories.map((cat) => {
                const cfg = categoryConfig[cat];
                const active = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderRadius: 999,
                      backgroundColor: active ? cfg.color : colors.backgroundMuted,
                      borderWidth: 1,
                      borderColor: active ? cfg.color : colors.borderLight,
                    }}
                  >
                    <MaterialCommunityIcons name={cfg.icon} size={14} color={active ? '#fff' : cfg.color} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : colors.textSecondary }}>{cat}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Icono */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 10 }}>ICONO</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {ICONS.map((ic) => (
                <Pressable
                  key={ic.name}
                  onPress={() => setSelectedIcon(ic.name)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: selectedIcon === ic.name ? colors.primary : colors.backgroundMuted,
                    borderWidth: 1.5,
                    borderColor: selectedIcon === ic.name ? colors.primary : colors.borderLight,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons name={ic.name} size={20} color={selectedIcon === ic.name ? '#fff' : colors.textSecondary} />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Color */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 10 }}>COLOR DE ACENTO</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setSelectedColor(c)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: c,
                    borderWidth: selectedColor === c ? 3 : 0,
                    borderColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ... (selectedColor === c ? { shadowColor: c, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 } : {}),
                  }}
                >
                  {selectedColor === c && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Frecuencia */}
          <View>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 10 }}>FRECUENCIA</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['Diario', 'Semanal', 'Personalizado'].map((f) => (
                <Pressable
                  key={f}
                  onPress={() => setFrequency(f)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: borderRadius.md,
                    backgroundColor: frequency === f ? colors.text : colors.backgroundMuted,
                    borderWidth: 1,
                    borderColor: frequency === f ? colors.text : colors.borderLight,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <MaterialCommunityIcons name={f === 'Diario' ? 'calendar-today' : f === 'Semanal' ? 'calendar-week' : 'calendar-edit'} size={14} color={frequency === f ? '#fff' : colors.textSecondary} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: frequency === f ? '#fff' : colors.textSecondary }}>{f}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleSaveHabit}
          style={({ pressed }) => ({
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            opacity: pressed ? 0.92 : 1,
            ...shadows.glow,
          })}
        >
          <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="check-decagram" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Guardar hábito</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, alignItems: 'center', paddingBottom: spacing.md }}>
          <MaterialCommunityIcons name="information-outline" size={12} color={colors.textTertiary} />
          <Text style={{ fontSize: 11, color: colors.textTertiary, textAlign: 'center' }}>Podrás editar o eliminar este hábito desde el inicio</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateHabitScreen;
