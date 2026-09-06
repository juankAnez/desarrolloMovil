// WelcomeScreen PRO - Onboarding 3 pasos rediseñado según maquetas HTML
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const SLIDES = [
  {
    icon: 'target-variant',
    title: 'Domina tus\nhábitos',
    desc: 'Transforma tu rutina diaria en un sistema de crecimiento continuo. Pequeños hábitos, grandes resultados.',
    gradient: ['#5850EC', '#6366F1', '#7C3AED'],
    accent: '#6366F1',
    activeColor: '#6366F1',
  },
  {
    icon: 'chart-timeline-variant-shimmer',
    title: 'Visualiza tu\nprogreso',
    desc: 'Gráficas claras, rachas motivadoras y estadísticas que te mantienen en el camino correcto.',
    gradient: ['#0ea5e9', '#2563eb', '#6366f1'],
    accent: '#0284c7',
    activeColor: '#2563eb',
  },
  {
    icon: 'fire',
    title: 'Mantén la\nracha viva',
    desc: 'Cada día cuenta. Celebra tus logros, supera tus límites y construye tu mejor versión.',
    gradient: ['#FF6F00', '#FF3D00', '#E91E63', '#7C3AED'],
    accent: '#FF3D00',
    activeColor: '#7C3AED',
  },
];

const WelcomeScreen = ({ onGetStarted }) => {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
        {/* Hero Header con gradiente y máscara curvada */}
        <LinearGradient
          colors={slide.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: spacing.xl + 10,
            paddingBottom: spacing.xl + 10,
            paddingHorizontal: spacing.lg,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            alignItems: 'center',
            ...shadows.lg,
          }}
        >
          {/* Top Bar Branding */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
                <MaterialCommunityIcons name="target-variant" size={20} color="#fff" />
              </View>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20, letterSpacing: -0.5 }}>FocusUp</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>v2.0</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>•</Text>
              <Text style={{ color: '#fde68a', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 }}>PRO</Text>
            </View>
          </View>

          {/* Icon Hero Squircle */}
          <View style={{ marginTop: spacing.xs, marginBottom: spacing.md, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 106, height: 106, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)', ...shadows.md }}>
              <View style={{ width: 78, height: 78, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', ...shadows.sm }}>
                <MaterialCommunityIcons name={slide.icon} size={40} color={slide.accent} />
              </View>
              {/* Question tooltip badge */}
              <View style={{ position: 'absolute', top: -6, right: -6, width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', ...shadows.sm }}>
                <Text style={{ fontSize: 12, fontWeight: '900', color: slide.accent }}>?</Text>
              </View>
            </View>
          </View>

          {/* Titles */}
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 36, letterSpacing: -1 }}>
            {slide.title}
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.92)', textAlign: 'center', marginTop: spacing.sm + 4, lineHeight: 20, paddingHorizontal: spacing.md }}>
            {slide.desc}
          </Text>
        </LinearGradient>

        {/* Pagination Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: spacing.lg, marginBottom: spacing.md }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 32 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === index ? slide.activeColor : '#cbd5e1',
              }}
            />
          ))}
        </View>

        {/* Feature Cards */}
        <View style={{ paddingHorizontal: spacing.lg, gap: 12, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: borderRadius.xl, padding: 14, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name="shield-check-outline" size={22} color="#6D28D9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>Crea hábitos inteligentes</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Nombre, meta y categoría en segundos</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
          </View>

          <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: borderRadius.xl, padding: 14, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.borderLight, ...shadows.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: '#ECFEFF', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name="trending-up" size={22} color="#0891B2" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>Seguimiento en tiempo real</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Barras y porcentajes actualizados al instante</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Footer Actions */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
          backgroundColor: colors.backgroundLight,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {index > 0 && (
            <Pressable
              onPress={() => setIndex((p) => p - 1)}
              style={({ pressed }) => ({
                width: 52,
                height: 52,
                borderRadius: borderRadius.lg,
                borderWidth: 1.5,
                borderColor: colors.border,
                backgroundColor: colors.backgroundLight,
                opacity: pressed ? 0.7 : 1,
                justifyContent: 'center',
                alignItems: 'center',
              })}
            >
              <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
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
            <LinearGradient colors={slide.gradient.slice(0, 2)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 52, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{isLast ? 'Comenzar ahora' : 'Continuar'}</Text>
              <MaterialCommunityIcons name={isLast ? 'rocket-launch' : 'arrow-right'} size={20} color={isLast ? '#fde68a' : '#fff'} />
            </LinearGradient>
          </Pressable>
        </View>

        {!isLast && (
          <Pressable onPress={onGetStarted} style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary }}>Saltar introducción →</Text>
          </Pressable>
        )}

        {isLast && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: spacing.md }}>
            <Text style={{ fontSize: 11, color: colors.textTertiary }}>Sin registro requerido</Text>
            <Text style={{ fontSize: 11, color: colors.textTertiary }}>•</Text>
            <Text style={{ fontSize: 11, color: colors.textTertiary }}>Datos locales</Text>
            <Text style={{ fontSize: 11, color: colors.textTertiary }}>•</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <MaterialCommunityIcons name="lock-outline" size={12} color="#059669" />
              <Text style={{ fontSize: 11, color: '#059669', fontWeight: '700' }}>100% privado</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default WelcomeScreen;
