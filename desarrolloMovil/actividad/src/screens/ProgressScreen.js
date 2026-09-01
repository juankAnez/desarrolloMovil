// ProgressScreen PRO - Dashboard analítico premium
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from '../components/ProgressBar';
import { colors, spacing, borderRadius, shadows, categoryConfig } from '../styles/theme';

const ProgressScreen = () => {
  const weeklyProgress = [
    { category: 'Estudio', percentage: 0.85 },
    { category: 'Ejercicio', percentage: 0.65 },
    { category: 'Lectura', percentage: 0.75 },
    { category: 'Hidratación', percentage: 0.9 },
  ];

  const weeklyGoalProgress = 0.78;
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const dayValues = [0.6, 0.8, 0.45, 0.9, 0.75, 0.85, 0.78];

  const achievements = [
    { icon: 'fire', label: 'Racha 7 días', color: colors.warning, bg: colors.warningLight },
    { icon: 'trophy', label: 'Top 10%', color: '#f59e0b', bg: '#fef3c7' },
    { icon: 'check-decagram', label: '12 hábitos', color: colors.success, bg: colors.successLight },
    { icon: 'trending-up', label: '+14% vs sem. ant.', color: colors.primary, bg: colors.primaryMuted },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      {/* Profile hero */}
      <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl + 10, borderBottomLeftRadius: borderRadius.xl, borderBottomRightRadius: borderRadius.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff' }}>J</Text>
              <View style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' }}>
                <MaterialCommunityIcons name="check" size={12} color="#fff" />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.4 }}>Juan Pérez</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                <MaterialCommunityIcons name="crown" size={12} color="#fde68a" />
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.4 }}>NIVEL PRODUCTIVO • 1.240 XP</Text>
              </View>
            </View>
          </View>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
            <MaterialCommunityIcons name="cog-outline" size={18} color="#fff" />
          </View>
        </View>

        {/* Stats pills inside hero */}
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
          {[
            { k: 'HÁBITOS', v: '12', sub: 'activos' },
            { k: 'COMPLETADOS', v: '86%', sub: 'este mes' },
            { k: 'RACHA', v: '7 🔥', sub: 'días' },
          ].map((s) => (
            <View key={s.k} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 0.7 }}>{s.k}</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginTop: 4 }}>{s.v}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{s.sub}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={{ padding: spacing.lg, gap: spacing.lg, marginTop: -16 }}>
        {/* Weekly chart */}
        <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <View>
              <Text style={{ fontSize: 15, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>Actividad semanal</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Lun 26 - Dom 01 • 78% promedio</Text>
            </View>
            <View style={{ backgroundColor: colors.successLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialCommunityIcons name="trending-up" size={12} color={colors.success} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.success }}>+14%</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 90, gap: 8 }}>
            {dayValues.map((v, i) => {
              const isToday = i === 6;
              return (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                  <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
                    <View style={{ height: `${Math.max(v * 100, 12)}%`, borderRadius: 10, overflow: 'hidden', backgroundColor: isToday ? colors.primary : colors.backgroundMuted, borderWidth: isToday ? 0 : 1, borderColor: colors.borderLight }}>
                      {isToday ? (
                        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={{ flex: 1 }} />
                      ) : (
                        <View style={{ flex: 1, backgroundColor: v > 0.7 ? colors.primary + '18' : colors.backgroundMuted }} />
                      )}
                    </View>
                  </View>
                  <View style={{ width: 28, height: 22, borderRadius: 999, backgroundColor: isToday ? colors.primary : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, fontWeight: isToday ? '800' : '600', color: isToday ? '#fff' : colors.textSecondary }}>{days[i]}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: colors.primary }} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary }}>Hoy</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: colors.border }} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary }}>Días previos</Text>
            </View>
          </View>
        </View>

        {/* Progreso por categoría */}
        <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: colors.text, letterSpacing: -0.3 }}>Progreso por categoría</Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, backgroundColor: colors.primaryMuted, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>SEMANAL</Text>
          </View>

          {weeklyProgress.map((item, idx) => {
            const cfg = categoryConfig[item.category];
            return (
              <View key={idx} style={{ marginBottom: idx === weeklyProgress.length - 1 ? 0 : spacing.md, backgroundColor: colors.backgroundMuted, borderRadius: borderRadius.lg, padding: spacing.md }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: cfg.bg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: cfg.color + '18' }}>
                      <MaterialCommunityIcons name={cfg.icon} size={16} color={cfg.color} />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{item.category}</Text>
                  </View>
                  <View style={{ backgroundColor: cfg.color, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff' }}>{Math.round(item.percentage * 100)}%</Text>
                  </View>
                </View>
                <ProgressBar progress={item.percentage} height={7} progressColor={cfg.color} />
              </View>
            );
          })}
        </View>

        {/* Objetivo semanal */}
        <LinearGradient colors={['#ecfdf5', '#ffffff']} style={{ borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.successLight, ...shadows.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name="target-variant" size={18} color="#fff" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>Objetivo semanal</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>78% completado • 11/14 hábitos</Text>
              </View>
            </View>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.successLight }}>
              <Text style={{ fontSize: 14, fontWeight: '900', color: colors.success }}>78%</Text>
            </View>
          </View>

          <View style={{ marginTop: spacing.md }}>
            <ProgressBar progress={weeklyGoalProgress} height={10} backgroundColor={colors.border} progressColor={colors.success} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md, backgroundColor: '#fff', padding: 10, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.successLight }}>
            <MaterialCommunityIcons name="party-popper" size={14} color={colors.success} />
            <Text style={{ fontSize: 12, color: colors.success, fontWeight: '700', flex: 1 }}>¡Casi llegás! Te faltan solo 3 hábitos para el 100%</Text>
          </View>
        </LinearGradient>

        {/* Logros */}
        <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: colors.text, letterSpacing: -0.3, marginBottom: spacing.md }}>Logros desbloqueados</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            {achievements.map((a, i) => (
              <View key={i} style={{ width: '47%', backgroundColor: colors.backgroundMuted, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: a.bg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: a.color + '18', marginBottom: 8 }}>
                  <MaterialCommunityIcons name={a.icon} size={18} color={a.color} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: colors.text, textAlign: 'center' }}>{a.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calendario racha */}
        <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>Racha diaria</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.warningLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>
              <MaterialCommunityIcons name="fire" size={12} color={colors.warning} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.warning }}>7 días seguidos</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const done = i < 6;
              const isToday = i === 6;
              return (
                <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      backgroundColor: done ? colors.success : isToday ? colors.primary : colors.backgroundMuted,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: done ? colors.success : isToday ? colors.primary : colors.borderLight,
                    }}
                  >
                    <MaterialCommunityIcons name={done ? 'check' : isToday ? 'star-four-points' : 'close'} size={16} color={done || isToday ? '#fff' : colors.textTertiary} />
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: isToday ? colors.primary : colors.textTertiary }}>{['L', 'M', 'X', 'J', 'V', 'S', 'Hoy'][i]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: spacing.md }} />
      </View>
    </ScrollView>
  );
};

export default ProgressScreen;
