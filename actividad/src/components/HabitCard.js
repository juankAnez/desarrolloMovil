// HabitCard PRO - Diseño premium con micro-interacciones
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from './ProgressBar';
import { colors, spacing, borderRadius, shadows, categoryConfig } from '../styles/theme';

const HabitCard = ({ icon, name, goal, progress, isCompleted, category = 'General', streak = 0, onPress }) => {
  const progressValue = progress ? progress.current / progress.total : isCompleted ? 1 : 0;
  const displayProgress = progress ? `${progress.current}/${progress.total}` : isCompleted ? 'Completado ✓' : 'Pendiente';
  const config = categoryConfig[category] || { icon: icon || 'star-outline', color: colors.primary, bg: colors.primaryMuted };
  const accentColor = isCompleted ? colors.success : config.color;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.96 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View
        style={{
          backgroundColor: colors.backgroundLight,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: isCompleted ? colors.successLight : colors.borderLight,
          ...shadows.sm,
        }}
      >
        {/* Top row: icon + meta + status */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Icon bubble con gradiente sutil */}
          <LinearGradient
            colors={isCompleted ? [colors.success + '20', colors.success + '08'] : [config.bg, '#fff']}
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing.md,
              borderWidth: 1,
              borderColor: isCompleted ? colors.success + '30' : config.color + '15',
            }}
          >
            <MaterialCommunityIcons name={icon || config.icon} size={24} color={accentColor} />
          </LinearGradient>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, letterSpacing: -0.2, flex: 1 }} numberOfLines={1}>
                {name}
              </Text>
              {isCompleted ? (
                <View style={{ backgroundColor: colors.successLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                  <MaterialCommunityIcons name="check" size={12} color={colors.success} />
                  <Text style={{ fontSize: 10, fontWeight: '800', color: colors.success, marginLeft: 4, letterSpacing: 0.5 }}>HECHO</Text>
                </View>
              ) : (
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.backgroundMuted, justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textTertiary} />
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
              <View style={{ backgroundColor: config.bg, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: config.color, letterSpacing: 0.3 }}>{category.toUpperCase()}</Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>•</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialCommunityIcons name="clock-outline" size={12} color={colors.textTertiary} />
                <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '500' }}>{goal}</Text>
              </View>
              {streak > 0 && (
                <>
                  <Text style={{ fontSize: 12, color: colors.textTertiary }}>•</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="fire" size={12} color={colors.warning} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.warning, marginLeft: 2 }}>{streak} días</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Progress section */}
        <View style={{ marginTop: spacing.md, backgroundColor: colors.backgroundMuted, borderRadius: borderRadius.md, padding: spacing.sm, paddingHorizontal: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.6 }}>PROGRESO</Text>
            <Text style={{ fontSize: 12, fontWeight: '800', color: accentColor }}>{displayProgress}</Text>
          </View>
          <ProgressBar progress={progressValue} height={6} backgroundColor={colors.border + '80'} progressColor={accentColor} useGradient={!isCompleted} />
          {!isCompleted && progress && (
            <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 6 }}>
              Te faltan {progress.total - progress.current} {progress.total - progress.current === 1 ? 'unidad' : 'unidades'} para completar
            </Text>
          )}
          {isCompleted && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
              <MaterialCommunityIcons name="party-popper" size={12} color={colors.success} />
              <Text style={{ fontSize: 11, color: colors.success, fontWeight: '600' }}>¡Excelente trabajo hoy!</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default HabitCard;
