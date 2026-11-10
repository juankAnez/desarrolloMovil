import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [modo, setModo] = useState<'entrar' | 'registro'>('entrar');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    const correoLimpio = email.trim();
    if (!correoLimpio.includes('@') || clave.length < 6) {
      Alert.alert(
        'Datos incompletos',
        'Ingresa un correo electrónico válido y una contraseña de al menos 6 caracteres.'
      );
      return;
    }

    setEnviando(true);
    try {
      if (modo === 'registro') {
        const { data, error } = await supabase.auth.signUp({
          email: correoLimpio,
          password: clave,
        });

        if (error) {
          if (error.message.includes('rate limit') || error.status === 429) {
            Alert.alert(
              'Límite de correos de Supabase',
              'Supabase tiene un límite de 3 correos por hora cuando "Confirm email" está activado.\n\nPara solucionarlo de inmediato: Ve a tu panel de Supabase en Authentication > Providers > Email y desactiva "Confirm email" para que no requiera enviar correos y el registro entre directo.'
            );
          } else {
            Alert.alert('Error al registrarse', error.message);
          }
          return;
        }

        if (data.user && !data.session) {
          Alert.alert(
            'Cuenta creada (Requiere confirmación)',
            'Tu cuenta se creó, pero tu proyecto de Supabase tiene "Confirm email" activado. Revisa tu correo para activarla, o para entrar de inmediato, desactiva "Confirm email" en tu Dashboard de Supabase (Authentication > Providers > Email).'
          );
        }
        // Si data.session existe, onAuthStateChange redirige de inmediato al chat
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: correoLimpio,
          password: clave,
        });

        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            Alert.alert(
              'Credenciales no válidas',
              'Correo o contraseña incorrectos.\n\nSi acabas de registrarte, asegúrate de haber desactivado "Confirm email" en Supabase o revisa si tu cuenta requiere confirmación por correo.'
            );
          } else {
            Alert.alert('No se pudo iniciar sesión', error.message);
          }
          return;
        }
        // Éxito: onAuthStateChange actualiza el estado y Stack.Protected muestra el chat
      }
    } catch (e) {
      Alert.alert('Error inesperado', (e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={s.pantalla}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo y Encabezado */}
          <View style={s.encabezado}>
            <View style={s.iconoBadge}>
              <Ionicons name="sparkles" size={32} color="#059669" />
            </View>
            <Text style={s.titulo}>Tutor IA</Text>
            <Text style={s.subtitulo}>
              Asistente de Programación Móvil · Uniguajira
            </Text>
          </View>

          {/* Tarjeta del Formulario */}
          <View style={s.tarjeta}>
            {/* Pestañas modo */}
            <View style={s.tabsModo}>
              <Pressable
                style={[s.tab, modo === 'entrar' && s.tabActivo]}
                onPress={() => setModo('entrar')}
              >
                <Text
                  style={[s.tabTexto, modo === 'entrar' && s.tabTextoActivo]}
                >
                  Iniciar Sesión
                </Text>
              </Pressable>
              <Pressable
                style={[s.tab, modo === 'registro' && s.tabActivo]}
                onPress={() => setModo('registro')}
              >
                <Text
                  style={[s.tabTexto, modo === 'registro' && s.tabTextoActivo]}
                >
                  Crear Cuenta
                </Text>
              </Pressable>
            </View>

            {/* Campo Correo */}
            <View style={s.campo}>
              <Text style={s.etiqueta}>Correo Institucional o Personal</Text>
              <View style={s.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#64748b" />
                <TextInput
                  style={s.input}
                  placeholder="estudiante@uniguajira.edu.co"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View style={s.campo}>
              <Text style={s.etiqueta}>Contraseña</Text>
              <View style={s.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                <TextInput
                  style={s.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!mostrarClave}
                  value={clave}
                  onChangeText={setClave}
                />
                <Pressable
                  onPress={() => setMostrarClave(!mostrarClave)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={mostrarClave ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            {/* Botón Principal */}
            <Pressable
              style={[s.boton, enviando && s.botonDeshabilitado]}
              onPress={enviar}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={s.botonTexto}>
                  {modo === 'entrar' ? 'Ingresar al Tutor' : 'Registrar Cuenta'}
                </Text>
              )}
            </Pressable>

            {/* Texto de apoyo */}
            <Text style={s.aviso}>
              Acceso protegido con Supabase Auth y sesión segura cifrada en Keychain / Keystore.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  encabezado: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 16,
  },
  tabsModo: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActivo: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  tabTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextoActivo: {
    color: '#059669',
    fontWeight: '700',
  },
  campo: {
    gap: 6,
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  boton: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  aviso: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 16,
    marginTop: 4,
  },
});
