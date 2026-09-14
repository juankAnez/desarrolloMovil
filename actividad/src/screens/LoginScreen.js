// LoginScreen PRO - Rediseñado según la maqueta HTML de Login
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const LoginScreen = ({ onLoginPress, onBackPress }) => {
  const [name, setName] = useState('Juan');
  const [email, setEmail] = useState('juan@focusup.app');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 4;

  const handleLogin = () => {
    if (!isEmailValid || !isPasswordValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginPress(name.trim() || 'Juan');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#6E42E5' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header Morado Profundo (#6E42E5) */}
        <View style={{ paddingTop: spacing.xl + 10, paddingBottom: spacing.xl + 20, paddingHorizontal: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <Pressable
              onPress={onBackPress}
              hitSlop={10}
              style={({ pressed }) => ({
                width: 42,
                height: 42,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }}>FOCUSUP</Text>
          </View>

          <View style={{ marginTop: spacing.xs }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1.8 }}>BIENVENIDO DE NUEVO</Text>
            <Text style={{ color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -0.8, marginTop: 4 }}>Inicia sesión</Text>
          </View>
        </View>

        {/* Card Principal Flotante (Solapa con esquinas superiores redondeadas a 36px) */}
        <View style={{ flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl + 10, ...shadows.lg }}>
          {/* Avatar Squircle Flotante */}
          <View style={{ alignItems: 'center', marginTop: -36, marginBottom: spacing.md }}>
            <LinearGradient colors={['#6536E4', '#8C60F8']} style={{ width: 72, height: 72, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff', ...shadows.md }}>
              <MaterialCommunityIcons name="account-circle" size={38} color="#fff" />
            </LinearGradient>
          </View>

          {/* Título y Subtítulo de bienvenida */}
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center', letterSpacing: -0.4 }}>¡Bienvenido a FocusUp!</Text>
            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4, lineHeight: 18 }}>Ingresa tu nombre y datos de acceso para continuar.</Text>
          </View>

          {/* Formulario */}
          <View style={{ gap: 16 }}>
            {/* Input 1: NOMBRE COMPLETO */}
            <View>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#334155', letterSpacing: 0.6, marginBottom: 8 }}>NOMBRE COMPLETO</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: focused === 'name' ? '#7042E8' : '#CBD5E1',
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.md,
                  backgroundColor: focused === 'name' ? '#F5F3FF' : '#F8FAFC',
                  height: 52,
                }}
              >
                <MaterialCommunityIcons name="account-outline" size={20} color={focused === 'name' ? '#7042E8' : '#94A3B8'} style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Ingresa tu nombre"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  style={{ flex: 1, fontSize: 15, color: '#0F172A', fontWeight: '600' }}
                />
                {name.length > 0 && (
                  <Pressable onPress={() => setName('')}>
                    <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Input 2: CORREO ELECTRÓNICO */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#334155', letterSpacing: 0.6 }}>CORREO ELECTRÓNICO</Text>
                {isEmailValid && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, borderWidth: 1, borderColor: '#A7F3D0' }}>
                    <MaterialCommunityIcons name="check" size={12} color="#059669" />
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#059669' }}>Válido</Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: focused === 'email' ? '#7042E8' : isEmailValid || email.length === 0 ? '#CBD5E1' : '#F59E0B',
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.md,
                  backgroundColor: focused === 'email' ? '#F5F3FF' : '#F8FAFC',
                  height: 52,
                }}
              >
                <MaterialCommunityIcons name="email-outline" size={20} color={focused === 'email' ? '#7042E8' : '#94A3B8'} style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="nombre@ejemplo.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={{ flex: 1, fontSize: 15, color: '#0F172A', fontWeight: '600' }}
                />
                {email.length > 0 && (
                  <Pressable onPress={() => setEmail('')}>
                    <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Input 3: CONTRASEÑA con barra de fuerza de 3 segmentos */}
            <View>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#334155', letterSpacing: 0.6, marginBottom: 8 }}>CONTRASEÑA</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: focused === 'pass' ? '#7042E8' : '#CBD5E1',
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.md,
                  backgroundColor: focused === 'pass' ? '#F5F3FF' : '#F8FAFC',
                  height: 52,
                }}
              >
                <MaterialCommunityIcons name="lock-outline" size={20} color={focused === 'pass' ? '#7042E8' : '#94A3B8'} style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  style={{ flex: 1, fontSize: 15, color: '#0F172A', fontWeight: '600' }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                  <MaterialCommunityIcons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#64748B" />
                </Pressable>
              </View>
              {/* Password strength 3 segments */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
                <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
                  <View style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: password.length >= 2 ? '#10B981' : '#E2E8F0' }} />
                  <View style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: password.length >= 6 ? '#10B981' : '#E2E8F0' }} />
                  <View style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: password.length >= 10 ? '#10B981' : '#E2E8F0' }} />
                </View>
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.5 }}>{password.length < 4 ? 'DÉBIL' : password.length < 8 ? 'MEDIA' : 'FUERTE'}</Text>
              </View>
            </View>

            {/* Fila Auxiliar: Recuérdame y Olvidaste contraseña */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 }}>
              <Pressable onPress={() => setRememberMe(!rememberMe)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: rememberMe ? '#6E42E5' : '#94A3B8', backgroundColor: rememberMe ? '#6E42E5' : '#fff', justifyContent: 'center', alignItems: 'center' }}>
                  {rememberMe && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569' }}>Recuérdame</Text>
              </Pressable>

              <Pressable>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#6E42E5' }}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>

            {/* Botón Principal CTA: Iniciar Sesión */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => ({
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                opacity: pressed || isLoading ? 0.9 : 1,
                marginTop: 4,
                ...shadows.glow,
              })}
            >
              <LinearGradient colors={['#6E42E5', '#7B4DF0', '#8856F5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 54, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                {isLoading ? (
                  <MaterialCommunityIcons name="loading" size={22} color="#fff" />
                ) : (
                  <>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Iniciar Sesión</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Separador "O CONTINÚA CON" */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.md }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 1.2 }}>O CONTINÚA CON</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
            </View>

            {/* Botones Sociales (Google, Apple, Facebook) */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { icon: 'google', label: 'Google' },
                { icon: 'apple', label: 'Apple' },
                { icon: 'facebook', label: 'Facebook' },
              ].map((s) => (
                <Pressable key={s.label} style={({ pressed }) => ({ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, height: 48, borderRadius: borderRadius.md, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff', opacity: pressed ? 0.7 : 1 })}>
                  <MaterialCommunityIcons name={s.icon} size={18} color="#475569" />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#334155' }}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
