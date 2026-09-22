import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../src/constants/colors';
import { Card } from '../src/components/Card';
import { CustomButton } from '../src/components/CustomButton';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Handle */}
        <View style={styles.handle} />

        <Card style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="information-circle" size={36} color={Colors.primary} />
          </View>

          <Text style={styles.title}>ServiGo Riohacha</Text>
          <Text style={styles.sub}>Plataforma Unificada de Prestación y Solicitud de Servicios</Text>

          {/* Modal Expo Router explanation */}
          <View style={styles.boxInfo}>
            <Text style={styles.boxTitle}>Navegación Modal (Expo Router)</Text>
            <Text style={styles.boxText}>
              Esta pantalla se invoca de manera flotante mediante la propiedad nativa:
            </Text>
            <Text style={styles.codeText}>options=&#123;&#123; presentation: &apos;modal&apos; &#125;&#125;</Text>
            <Text style={styles.boxText}>
              Cumple con el requisito de arquitectura de navegación en Stack/Modal.
            </Text>
          </View>

          {/* Test Credentials Reminder */}
          <View style={styles.credsBox}>
            <Text style={styles.credsTitle}>Credenciales de Evaluación Académica</Text>
            <View style={styles.credRow}>
              <Ionicons name="person" size={14} color={Colors.primary} />
              <Text style={styles.credLabel}>CLIENTE:</Text>
              <Text style={styles.credValue}>cliente@test.com / 123456</Text>
            </View>
            <View style={styles.credRow}>
              <Ionicons name="briefcase" size={14} color={Colors.secondary} />
              <Text style={styles.credLabel}>PRESTADOR:</Text>
              <Text style={styles.credValue}>prestador@test.com / 123456</Text>
            </View>
          </View>

          {/* Ciclo de Estados */}
          <View style={styles.statesBox}>
            <Text style={styles.statesTitle}>Flujo de 5 Estados de la Solicitud</Text>
            <Text style={styles.statesText}>
              1. <Text style={styles.bold}>PENDING</Text>: Solicitud creada por el cliente.{'\n'}
              2. <Text style={styles.bold}>ACCEPTED</Text>: Prestador acepta el trabajo.{'\n'}
              3. <Text style={styles.bold}>ON_THE_WAY</Text>: Prestador en ruta con GPS activo.{'\n'}
              4. <Text style={styles.bold}>IN_PROGRESS</Text>: Trabajo en ejecución en Riohacha.{'\n'}
              5. <Text style={styles.bold}>COMPLETED</Text>: Servicio finalizado exitosamente.
            </Text>
          </View>

          <CustomButton
            title="Entendido, Volver a la App"
            variant="primary"
            onPress={() => router.back()}
            style={styles.closeBtn}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 36,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  boxInfo: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 12,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  boxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  boxText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  credsBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: 12,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 6,
  },
  credsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  credRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  credLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.text,
  },
  credValue: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  statesBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  statesText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '800',
    color: Colors.text,
  },
  closeBtn: {
    width: '100%',
  },
});
