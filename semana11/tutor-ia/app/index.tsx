import { useChat } from '@ai-sdk/react';
import type { FileUIPart } from 'ai';
import { Stack } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Burbuja } from '../components/Burbuja';
import { crearTransporte } from '../lib/chatTransport';
import { elegirFoto } from '../lib/foto';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const SUGERENCIAS = [
  '💡 ¿Cómo funciona el streaming en useChat?',
  '⚡ ¿Cómo optimizar un FlatList pesado?',
  '📸 Analicemos un error en una foto',
  '🔄 Diferencia entre useMemo y useCallback',
];

export default function Chat() {
  const { session } = useAuth();
  const transport = useMemo(() => crearTransporte(), []);
  const { messages, sendMessage, status, error, stop, clearError } = useChat({ transport });
  const [texto, setTexto] = useState('');
  const [foto, setFoto] = useState<FileUIPart | null>(null);
  const [tecladoVisible, setTecladoVisible] = useState(false);
  const lista = useRef<FlatList>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTecladoVisible(true);
        setTimeout(() => lista.current?.scrollToEnd({ animated: true }), 100);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setTecladoVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const ocupado = status === 'submitted' || status === 'streaming';

  function enviar(textoPersonalizado?: string) {
    const t = (textoPersonalizado ?? texto).trim();
    if (!t && !foto) return;

    sendMessage({
      text: t || '¿Qué observas en esta imagen? Explícamelo detalladamente.',
      files: foto ? [foto] : undefined,
    });

    if (!textoPersonalizado) {
      setTexto('');
    }
    setFoto(null);
  }

  async function adjuntar(origen: 'camara' | 'galeria') {
    try {
      const f = await elegirFoto(origen);
      if (f) setFoto(f);
    } catch (e) {
      Alert.alert('Acceso a multimedia', (e as Error).message);
    }
  }

  function confirmarCerrarSesion() {
    Alert.alert(
      'Cerrar sesión',
      `¿Deseas salir de la cuenta ${session?.user.email ?? ''}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => supabase.auth.signOut(),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={s.pantalla} edges={tecladoVisible ? [] : ['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <View style={s.headerTitleContainer}>
              <View style={s.headerDot} />
              <View>
                <Text style={s.headerTitle}>Tutor IA</Text>
                <Text style={s.headerSubtitle}>Móvil Avanzada · Uniguajira</Text>
              </View>
            </View>
          ),
          headerStyle: { backgroundColor: '#ffffff' },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              onPress={confirmarCerrarSesion}
              style={s.botonSalir}
              hitSlop={8}
              accessibilityLabel="Cerrar sesión"
            >
              <Ionicons name="log-out-outline" size={22} color="#dc2626" />
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 95 : 0}
      >
        <FlatList
          ref={lista}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Burbuja mensaje={item} />}
          contentContainerStyle={s.listaContenido}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => lista.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={s.vacioContainer}>
              <View style={s.iconoHero}>
                <Ionicons name="school-outline" size={42} color="#059669" />
              </View>
              <Text style={s.vacioTitulo}>¡Hola! Soy tu Tutor IA</Text>
              <Text style={s.vacioDesc}>
                Estoy aquí para ayudarte con conceptos, arquitectura, solución de bugs en React Native o
                analizar capturas de pantalla de tu código.
              </Text>

              <Text style={s.sugerenciasLabel}>Prueba preguntando:</Text>
              <View style={s.sugerenciasGrid}>
                {SUGERENCIAS.map((sug, i) => (
                  <Pressable
                    key={i}
                    style={s.chipSugerencia}
                    onPress={() => enviar(sug)}
                  >
                    <Text style={s.chipTexto}>{sug}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          }
        />

        {/* Indicador de pensamiento previo al stream */}
        {status === 'submitted' && (
          <View style={s.indicadorPensando}>
            <ActivityIndicator size="small" color="#059669" />
            <Text style={s.indicadorPensandoTexto}>El tutor está analizando tu consulta…</Text>
          </View>
        )}

        {/* Banner de error interactivo */}
        {error && (
          <Pressable style={s.errorContainer} onPress={clearError}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <View style={{ flex: 1 }}>
              <Text style={s.errorTexto}>
                {error.message?.includes('NOT_FOUND') || error.message?.includes('not found')
                  ? 'No se pudo conectar con la Edge Function del Tutor en Supabase. Intenta de nuevo.'
                  : error.message}
              </Text>
              <Text style={s.errorCerrar}>Toca para descartar</Text>
            </View>
            <Ionicons name="close" size={18} color="#dc2626" />
          </Pressable>
        )}

        {/* Previsualización de foto adjunta */}
        {foto && (
          <View style={s.previaFoto}>
            <Image source={{ uri: foto.url }} style={s.miniaturaFoto} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={s.previaTitulo}>Foto adjunta</Text>
              <Text style={s.previaSub}>Se enviará a Gemini para análisis multimodal</Text>
            </View>
            <Pressable
              onPress={() => setFoto(null)}
              style={s.botonQuitarFoto}
              hitSlop={6}
            >
              <Ionicons name="close-circle" size={22} color="#64748b" />
            </Pressable>
          </View>
        )}

        {/* Barra inferior moderna de entrada */}
        <View style={s.barraEntrada}>
          <View style={s.accionesMultimedia}>
            <Pressable
              style={s.botonMultimedia}
              onPress={() => adjuntar('camara')}
              disabled={ocupado}
              hitSlop={6}
            >
              <Ionicons
                name="camera"
                size={22}
                color={ocupado ? '#cbd5e1' : '#059669'}
              />
            </Pressable>
            <Pressable
              style={s.botonMultimedia}
              onPress={() => adjuntar('galeria')}
              disabled={ocupado}
              hitSlop={6}
            >
              <Ionicons
                name="images"
                size={22}
                color={ocupado ? '#cbd5e1' : '#059669'}
              />
            </Pressable>
          </View>

          <TextInput
            style={s.inputTexto}
            placeholder={foto ? 'Añade una pregunta sobre la foto…' : 'Escribe tu consulta…'}
            placeholderTextColor="#94a3b8"
            value={texto}
            onChangeText={setTexto}
            multiline
            maxLength={1000}
            editable={!ocupado}
          />

          {ocupado ? (
            <Pressable style={s.botonDetener} onPress={stop} hitSlop={6}>
              <Ionicons name="stop" size={16} color="#ffffff" />
            </Pressable>
          ) : (
            <Pressable
              style={[
                s.botonEnviar,
                !texto.trim() && !foto ? s.botonEnviarInactivo : s.botonEnviarActivo,
              ]}
              onPress={() => enviar()}
              disabled={!texto.trim() && !foto}
              hitSlop={6}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={!texto.trim() && !foto ? '#94a3b8' : '#ffffff'}
              />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  botonSalir: {
    padding: 6,
    marginRight: 4,
  },
  listaContenido: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  vacioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 8,
  },
  iconoHero: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  vacioTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  vacioDesc: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  sugerenciasLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
  },
  sugerenciasGrid: {
    width: '100%',
    gap: 8,
  },
  chipSugerencia: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  chipTexto: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  indicadorPensando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  indicadorPensandoTexto: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 14,
    marginBottom: 8,
    gap: 10,
  },
  errorTexto: {
    color: '#991b1b',
    fontSize: 12,
    fontWeight: '600',
  },
  errorCerrar: {
    color: '#dc2626',
    fontSize: 11,
    marginTop: 2,
  },
  previaFoto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 6,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  miniaturaFoto: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  previaTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  previaSub: {
    fontSize: 11,
    color: '#64748b',
  },
  botonQuitarFoto: {
    padding: 4,
  },
  barraEntrada: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  accionesMultimedia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  botonMultimedia: {
    padding: 6,
    borderRadius: 20,
  },
  inputTexto: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    maxHeight: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  botonEnviar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonEnviarActivo: {
    backgroundColor: '#059669',
  },
  botonEnviarInactivo: {
    backgroundColor: '#f1f5f9',
  },
  botonDetener: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
