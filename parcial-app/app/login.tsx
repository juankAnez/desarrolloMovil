import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/context/AuthContext';
import { Colors, Radius, Shadows } from '../src/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // Estados de autenticación
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'PROVIDER'>('CLIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Cambiar pestaña de rol
  const handleSelectRole = (role: 'CLIENT' | 'PROVIDER') => {
    setSelectedRole(role);
    setErrorMessage('');
  };

  // Carga rápida con 1-Tap Demo
  const handleQuickLoad = (role: 'CLIENT' | 'PROVIDER', targetEmail: string, targetPass: string) => {
    setSelectedRole(role);
    setEmail(targetEmail);
    setPassword(targetPass);
    setErrorMessage('');
  };

  // Enviar formulario
  const handleLogin = () => {
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor completa tu correo y contraseña para continuar.');
      return;
    }

    const result = login(email, password);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.message || 'Credenciales inválidas. Verifica tus datos.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Contraseña',
      'En este entorno de evaluación, utiliza las credenciales de prueba preconfiguradas (123456).',
      [{ text: 'Entendido' }]
    );
  };

  const handleRegisterNotice = () => {
    Alert.alert(
      'Registro de Nuevos Usuarios',
      'El registro directo estará disponible al conectar la API backend oficial. Por ahora utiliza las cuentas demo.',
      [{ text: 'Aceptar' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      
      {/* Fondo degradado suave superior */}
      <LinearGradient
        colors={['#EFF6FF', '#F1F5F9', '#F8FAFC']}
        style={styles.topGradientBg}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ================= HEADER & BRANDING ================= */}
        <View style={styles.brandContainer}>
          {/* Logo flotante moderno con gradient y badge de estado */}
          <View style={styles.logoWrapper}>
            <LinearGradient
              colors={['#2563EB', '#4F46E5']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="construct" size={34} color="#FFFFFF" />
            </LinearGradient>

            {/* Punto indicador de sistema activo */}
            <View style={styles.statusDotRing}>
              <View style={styles.statusDot} />
            </View>
          </View>

          {/* Nombre de la Marca */}
          <View style={styles.titleRow}>
            <Text style={styles.brandTitleBlack}>Servi</Text>
            <Text style={styles.brandTitleBlue}>Go</Text>
          </View>

          {/* Subtítulo de confianza */}
          <Text style={styles.brandSubtitle}>
            Tu plataforma de confianza para servicios del hogar, tecnología y profesionales
          </Text>

          {/* Badge de Ubicación y Contexto */}
          <View style={styles.locationPill}>
            <Ionicons name="location-sharp" size={13} color="#2563EB" />
            <Text style={styles.locationText}>Riohacha, La Guajira</Text>
          </View>
        </View>

        {/* ================= TARJETA PRINCIPAL ================= */}
        <View style={styles.mainCard}>
          {/* Selector de Rol Segmentado */}
          <View style={styles.segmentedContainer}>
            <Pressable
              style={[
                styles.segmentTab,
                selectedRole === 'CLIENT' && styles.segmentTabActive,
              ]}
              onPress={() => handleSelectRole('CLIENT')}
            >
              <Ionicons
                name="person"
                size={16}
                color={selectedRole === 'CLIENT' ? '#2563EB' : '#64748B'}
              />
              <Text
                style={[
                  styles.segmentText,
                  selectedRole === 'CLIENT' && styles.segmentTextActive,
                ]}
              >
                Soy Cliente
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.segmentTab,
                selectedRole === 'PROVIDER' && styles.segmentTabActive,
              ]}
              onPress={() => handleSelectRole('PROVIDER')}
            >
              <Ionicons
                name="briefcase"
                size={16}
                color={selectedRole === 'PROVIDER' ? '#2563EB' : '#64748B'}
              />
              <Text
                style={[
                  styles.segmentText,
                  selectedRole === 'PROVIDER' && styles.segmentTextActive,
                ]}
              >
                Soy Prestador
              </Text>
            </Pressable>
          </View>

          {/* Subtítulo Dinámico según el Rol Seleccionado */}
          <View style={styles.roleBanner}>
            <Ionicons
              name={selectedRole === 'CLIENT' ? 'sparkles-outline' : 'construct-outline'}
              size={14}
              color={selectedRole === 'CLIENT' ? '#2563EB' : '#4F46E5'}
            />
            <Text style={styles.roleBannerText}>
              {selectedRole === 'CLIENT'
                ? 'Accede para contratar y gestionar servicios rápidos'
                : 'Accede a tu panel técnico y órdenes de trabajo activas'}
            </Text>
          </View>

          {/* Alerta de Error */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* ================= CAMPOS DE FORMULARIO ================= */}
          {/* Campo de Correo */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#94A3B8"
                style={styles.inputLeftIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="tu.correo@ejemplo.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Campo de Contraseña */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Contraseña</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#94A3B8"
                style={styles.inputLeftIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#64748B"
                />
              </Pressable>
            </View>
          </View>

          {/* Opciones: Recordar dispositivo y Olvidaste */}
          <View style={styles.optionsRow}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[
                  styles.checkboxSquare,
                  rememberMe && styles.checkboxSquareChecked,
                ]}
              >
                {rememberMe && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Recordar este dispositivo</Text>
            </Pressable>

            <Pressable onPress={handleForgotPassword} hitSlop={6}>
              <Text style={styles.forgotLink}>¿La olvidaste?</Text>
            </Pressable>
          </View>

          {/* Botón Principal Gradiente */}
          <Pressable
            style={({ pressed }) => [
              styles.submitButtonContainer,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={['#2563EB', '#4F46E5']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitButtonText}>Ingresar al Sistema</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>

          {/* ================= DEMO 1-TAP / ACCESO RÁPIDO ================= */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeaderRow}>
              <Text style={styles.demoHeaderTitle}>ACCESO RÁPIDO DE EVALUACIÓN</Text>
              <View style={styles.demoBadge}>
                <Ionicons name="flash" size={10} color="#D97706" />
                <Text style={styles.demoBadgeText}>Demo 1-Tap</Text>
              </View>
            </View>

            <Text style={styles.demoSubtitle}>
              Toca para autocompletar credenciales en los campos:
            </Text>

            <View style={styles.demoCardsContainer}>
              {/* Card Rol Cliente */}
              <Pressable
                style={({ pressed }) => [
                  styles.demoCard,
                  styles.demoCardClient,
                  pressed && styles.demoCardPressed,
                ]}
                onPress={() => handleQuickLoad('CLIENT', 'cliente@test.com', '123456')}
              >
                <View style={styles.demoIconCircleClient}>
                  <Ionicons name="person" size={16} color="#2563EB" />
                </View>
                <View style={styles.demoCardContent}>
                  <View style={styles.demoCardTopLine}>
                    <Text style={styles.demoCardRole}>Rol CLIENTE</Text>
                    <View style={styles.passPill}>
                      <Text style={styles.passPillText}>123456</Text>
                    </View>
                  </View>
                  <Text style={styles.demoCardEmail}>cliente@test.com</Text>
                </View>
                <View style={styles.loadPill}>
                  <Text style={styles.loadPillText}>Cargar</Text>
                  <Ionicons name="arrow-forward" size={12} color="#2563EB" />
                </View>
              </Pressable>

              {/* Card Rol Prestador */}
              <Pressable
                style={({ pressed }) => [
                  styles.demoCard,
                  styles.demoCardProvider,
                  pressed && styles.demoCardPressed,
                ]}
                onPress={() => handleQuickLoad('PROVIDER', 'prestador@test.com', '123456')}
              >
                <View style={styles.demoIconCircleProvider}>
                  <Ionicons name="briefcase" size={16} color="#4F46E5" />
                </View>
                <View style={styles.demoCardContent}>
                  <View style={styles.demoCardTopLine}>
                    <Text style={styles.demoCardRole}>Rol PRESTADOR</Text>
                    <View style={styles.passPill}>
                      <Text style={styles.passPillText}>123456</Text>
                    </View>
                  </View>
                  <Text style={styles.demoCardEmail}>prestador@test.com</Text>
                </View>
                <View style={styles.loadPill}>
                  <Text style={styles.loadPillText}>Cargar</Text>
                  <Ionicons name="arrow-forward" size={12} color="#4F46E5" />
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ================= FOOTER ================= */}
        <View style={styles.footerContainer}>
          <Pressable onPress={handleRegisterNotice} style={styles.registerRow}>
            <Text style={styles.registerPrompt}>¿No tienes una cuenta aún? </Text>
            <Text style={styles.registerLink}>Regístrate gratis</Text>
          </Pressable>

          <Text style={styles.academicFooter}>
            Parcial Desarrollo Móvil • Universidad de La Guajira • 2026
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topGradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 40,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },

  /* BRANDING */
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  logoGradient: {
    width: 70,
    height: 70,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  statusDotRing: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitleBlack: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandTitleBlue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 24,
    lineHeight: 18,
    fontWeight: '500',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 10,
    gap: 5,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  /* MAIN CARD */
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },

  /* SEGMENTED SWITCHER */
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 7,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* ROLE BANNER */
  roleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 18,
    gap: 8,
  },
  roleBannerText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },

  /* ERROR BANNER */
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
  },

  /* FORM GROUPS */
  formGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  eyeButton: {
    padding: 6,
  },

  /* OPTIONS ROW */
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSquareChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* PRIMARY BUTTON */
  submitButtonContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  submitGradient: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  /* DEMO 1-TAP SECTION */
  demoSection: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  demoHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    gap: 4,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  demoSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 10,
  },
  demoCardsContainer: {
    gap: 9,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    gap: 10,
  },
  demoCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  demoCardClient: {
    backgroundColor: '#F0F7FF',
    borderColor: '#BFDBFE',
  },
  demoCardProvider: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  demoIconCircleClient: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  demoIconCircleProvider: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoCardContent: {
    flex: 1,
  },
  demoCardTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoCardRole: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  passPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  demoCardEmail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  loadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  loadPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },

  /* FOOTER */
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerPrompt: {
    fontSize: 13,
    color: '#64748B',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  academicFooter: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
