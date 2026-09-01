// WelcomeScreen PRO - Onboarding 3 pasos con gradiente y paginación
import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'target-variant',
    title: 'Domina tus\nhábitos',
    desc: 'Transforma tu rutina diaria en un sistema de crecimiento continuo. Pequeños hábitos, grandes resultados.',
    gradient: ['#6366f1', '#8b5cf6'],
    accent: '#6366f1',
  },
  {
    icon: 'chart-timeline-variant-shimmer',
    title: 'Visualiza tu\nprogreso',
    desc: 'Gráficas claras, rachas motivadoras y estadísticas que te mantienen en el camino correcto.',
    gradient: ['#06b6d4', '#6366f1'],
    accent: '#06b6d4',
  },
  {
    icon: 'fire',
    title: 'Mantén la\nracha viva',
    desc: 'Cada día cuenta. Celebra tus logros, supera tus límites y construye tu mejor versión.',
    gradient: ['#f59e0b', '#ec4899'],
    accent: '#f59e0b',
  },
];

const WelcomeScreen = ({ onGetStarted }) => {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Hero con gradiente */}
        <LinearGradient
          colors={slide.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: spacing['3xl'] + 10,
            paddingBottom: spacing.xl + 10,
            paddingHorizontal: spacing.lg,
            borderBottomLeftRadius: borderRadius['2xl'],
            borderBottomRightRadius: borderRadius['2xl'],
            alignItems: 'center',
          }}
        >
          {/* Top bar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
                <MaterialCommunityIcons name="target-variant" size={18} color="#fff" />
              </View>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: -0.3 }}>FocusUp</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>v2.0 • PRO</Text>
            </View>
          </View>

          {/* Icon hero */}
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 32,
              backgroundColor: 'rgba(255,255,255,0.18)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.25)',
              marginBottom: spacing.lg,
              ...shadows.lg,
            }}
          >
            <View style={{ width: 74, height: 74, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name={slide.icon} size={36} color={slide.accent} />
            </View>
            {/* sparkle */}
            <View style={{ position: 'absolute', top: -6, right: -6, width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', ...shadows.md }}>
              <MaterialCommunityIcons name="sparkles" size={14} color={slide.accent} />
            </View>
          </View>

          <Text style={{ fontSize: 34, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 38, letterSpacing: -1.2 }}>
            {slide.title}
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: spacing.md, lineHeight: 20, paddingHorizontal: spacing.md }}>
            {slide.desc}
          </Text>
        </LinearGradient>

        {/* Paginación */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: spacing.lg }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 28 : 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: i === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>

        {/* Cards features premium */}
        <View style={{ padding: spacing.lg, gap: spacing.md, marginTop: spacing.md }}>
          <FeatureRow icon="check-decagram" title="Crea hábitos inteligentes" desc="Nombre, meta y categoría en segundos" color="#6366f1" />
          <FeatureRow icon="chart-bell-curve-cumulative" title="Seguimiento en tiempo real" desc="Barras y porcentajes actualizados al instante" color="#06b6d4" />
          <FeatureRow icon="medal-outline" title="Sistema de rachas" desc="Motivación diaria para no romper la cadena" color="#f59e0b" />
        </View>

        {/* Social proof */}
        <View
          style={{
            marginHorizontal: spacing.lg,
            backgroundColor: colors.backgroundLight,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.borderLight,
            ...shadows.sm,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {[1, 2, 3].map((n) => (
              <View
                key={n}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: ['#eef2ff', '#fce7f3', '#cffafe'][n - 1],
                  borderWidth: 2,
                  borderColor: '#fff',
                  marginLeft: n === 1 ? 0 : -10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name={['account', 'account-outline', 'account-star'][n - 1]} size={16} color={colors.primary} />
              </View>
            ))}
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <MaterialCommunityIcons key={s} name="star" size={12} color="#f59e0b" />
              ))}
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text, marginLeft: 4 }}>4.9 / 5</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>+12k estudiantes lo usan a diario</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA - fixed */}
      <View
        style={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
          backgroundColor: colors.backgroundLight,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
        }}
      >
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {index > 0 && (
            <Pressable
              onPress={() => setIndex((p) => p - 1)}
              style={({ pressed }) => ({
                paddingHorizontal: spacing.lg,
                paddingVertical: 16,
                borderRadius: borderRadius.lg,
                borderWidth: 1.5,
                borderColor: colors.border,
                backgroundColor: colors.backgroundLight,
                opacity: pressed ? 0.7 : 1,
                justifyContent: 'center',
              })}
            >
              <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textSecondary} />
            </Pressable>
          )}

          <Pressable
            onPress={() => (isLast ? onGetStarted() : setIndex((p) => p + 1))}
            style={({ pressed }) => ({
              flex: 1,
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              opacity: pressed ? 0.9 : 1,
              ...shadows.glow,
            })}
          >
            <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.2 }}>{isLast ? 'Comenzar ahora' : 'Continuar'}</Text>
              <MaterialCommunityIcons name={isLast ? 'rocket-launch-outline' : 'arrow-right'} size={18} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>

        {!isLast && (
          <Pressable onPress={onGetStarted} style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textTertiary }}>Saltar introducción →</Text>
          </Pressable>
        )}
        {isLast && (
          <Text style={{ fontSize: 11, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md }}>Sin registro requerido • Datos locales • 100% privado</Text>
        )}
      </View>
    </View>
  );
};

const FeatureRow = ({ icon, title, desc, color }) => (
  <View style={{ flexDirection: 'row', backgroundColor: colors.backgroundLight, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs }}>
    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: color + '15', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md, borderWidth: 1, borderColor: color + '18' }}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{title}</Text>
      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{desc}</Text>
    </View>
    <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} style={{ opacity: 0.9 }} />
  </View>
);

export default WelcomeScreen;
