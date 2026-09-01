// LoginScreen PRO - Glass + validación premium
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const LoginScreen = ({ onLoginPress }) => {
  const [email, setEmail] = useState('juan@focusup.app');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 4;

  const handleLogin = () => {
    if (!isEmailValid || !isPasswordValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginPress();
    }, 1100);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header gradient */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 180,
            borderBottomLeftRadius: borderRadius['2xl'],
            borderBottomRightRadius: borderRadius['2xl'],
            paddingTop: spacing.xl + 10,
            paddingHorizontal: spacing.lg,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#fff" />
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>DEMO • SIN BACKEND</Text>
            </View>
          </View>
          <View style={{ marginTop: spacing.lg }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>BIENVENIDO DE NUEVO</Text>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 4 }}>Inicia sesión</Text>
          </View>
        </LinearGradient>

        {/* Card flotante */}
        <View style={{ marginTop: -36, paddingHorizontal: spacing.lg }}>
          <View style={{ backgroundColor: colors.backgroundLight, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.lg, borderWidth: 1, borderColor: colors.borderLight }}>
            {/* Avatar pill */}
            <View style={{ alignItems: 'center', marginTop: -42, marginBottom: spacing.md }}>
              <LinearGradient colors={['#6366f1', '#8b5cf6']} style={{ width: 72, height: 72, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff', ...shadows.md }}>
                <MaterialCommunityIcons name="account-circle" size={36} color="#fff" />
              </LinearGradient>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: colors.primaryMuted, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 0.4 }}>MODO DEMO ACTIVO</Text>
              </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, textAlign: 'center', letterSpacing: -0.3 }}>Acceso rápido</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 4, lineHeight: 18 }}>Usa cualquier correo y contraseña para entrar. Sin validación real.</Text>

            {/* Email */}
            <View style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6 }}>CORREO ELECTRÓNICO</Text>
                {email.length > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name={isEmailValid ? 'check-circle' : 'alert-circle-outline'} size={12} color={isEmailValid ? colors.success : colors.warning} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isEmailValid ? colors.success : colors.warning }}>{isEmailValid ? 'Válido' : 'Revisa formato'}</Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: focused === 'email' ? colors.primary : isEmailValid || email.length === 0 ? colors.border : colors.warning + '60',
                  borderRadius: borderRadius.md,
                  paddingHorizontal: spacing.md,
                  backgroundColor: focused === 'email' ? colors.primaryMuted + '60' : colors.background,
                  height: 52,
                }}
              >
                <MaterialCommunityIcons name="email-outline" size={18} color={focused === 'email' ? colors.primary : colors.textTertiary} style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="juan@focusup.app"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={{ flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' }}
                />
                {email.length > 0 && (
                  <Pressable onPress={() => setEmail('')}>
                    <MaterialCommunityIcons name="close-circle" size={18} color={colors.textTertiary} />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Password */}
            <View style={{ marginBottom: spacing.md }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text, letterSpacing: 0.6, marginBottom: 8 }}>CONTRASEÑA</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: focused === 'pass' ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                  paddingHorizontal: spacing.md,
                  backgroundColor: focused === 'pass' ? colors.primaryMuted + '60' : colors.background,
                  height: 52,
                }}
              >
                <MaterialCommunityIcons name="lock-outline" size={18} color={focused === 'pass' ? colors.primary : colors.textTertiary} style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  style={{ flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                  <MaterialCommunityIcons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.textSecondary} />
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={{ flex: 1, height: 3, borderRadius: 999, backgroundColor: password.length >= i * 2 ? colors.success : colors.border }} />
                ))}
                <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textTertiary, marginLeft: 6 }}>{password.length < 4 ? 'DÉBIL' : password.length < 8 ? 'MEDIA' : 'FUERTE'}</Text>
              </View>
            </View>

            {/* Options */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing.md }}>
              <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 18, height: 18, borderRadius: 6, borderWidth: 1.5, borderColor: colors.borderStrong, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 3, backgroundColor: 'transparent' }} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Recuérdame</Text>
              </Pressable>
              <Pressable>
                <Text style={{ fontSize: 12, fontWeight: '800', color: colors.primary }}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>

            {/* CTA */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => ({
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                opacity: pressed || isLoading ? 0.9 : 1,
                marginTop: spacing.sm,
                ...shadows.glow,
              })}
            >
              <LinearGradient colors={isEmailValid && isPasswordValid ? ['#6366f1', '#8b5cf6'] : ['#cbd5e1', '#94a3b8']} style={{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                {isLoading ? (
                  <MaterialCommunityIcons name="loading" size={20} color="#fff" />
                ) : (
                  <>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Iniciar Sesión</Text>
                    <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.lg }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.borderLight }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.6 }}>O CONTINÚA CON</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.borderLight }} />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              {[
                { icon: 'google', label: 'Google' },
                { icon: 'apple', label: 'Apple' },
                { icon: 'facebook', label: 'Facebook' },
              ].map((s) => (
                <Pressable key={s.label} style={({ pressed }) => ({ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 12, borderRadius: borderRadius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.backgroundLight, opacity: pressed ? 0.7 : 1 })}>
                  <MaterialCommunityIcons name={s.icon} size={18} color={colors.textSecondary} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary }}>{s.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg }}>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>¿No tienes cuenta? </Text>
              <Text style={{ fontSize: 12, fontWeight: '800', color: colors.primary }}>Regístrate gratis</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
            <Text style={{ fontSize: 11, color: colors.textTertiary, textAlign: 'center', lineHeight: 16 }}>Al continuar aceptas nuestros Términos y Política de Privacidad.</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, alignItems: 'center' }}>
              <MaterialCommunityIcons name="shield-check-outline" size={12} color={colors.success} />
              <Text style={{ fontSize: 11, color: colors.success, fontWeight: '600' }}>Datos 100% locales • Sin tracking</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
