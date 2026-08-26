import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function App() {
  // Lista de 3 tecnologías con NOMBRES DE ICONOS de @expo/vector-icons (Ionicons)
  // Puedes buscar más nombres en: https://icons.expo.fyi/
  const skills = [
    {
      id: '1',
      title: 'React Native & TypeScript',
      iconName: 'code-slash-outline' as const,
      color: '#00D8FF',
    },
    {
      id: '2',
      title: 'JavaScript (ES6+) & Mobile UI',
      iconName: 'logo-javascript' as const,
      color: '#F7DF1E',
    },
    {
      id: '3',
      title: 'Git & Expo Tooling',
      iconName: 'git-branch-outline' as const,
      color: '#38BDF8',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de Encabezado Decorativo */}
        <View style={styles.headerBanner} />

        {/* Tarjeta Principal de Perfil */}
        <View style={styles.card}>
          {/* Contenedor del Avatar / Foto */}
          <View style={styles.avatarContainer}>
            <Image
              source={require('./assets/avatar.jpeg')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.onlineBadge} />
          </View>

          {/* Nombre Completo */}
          <Text style={styles.name}>Juan Carlos Añez Ahumada</Text>

          {/* Rol / Carrera */}
          <View style={styles.roleTag}>
            <Ionicons name="school-outline" size={14} color="#38BDF8" style={{ marginRight: 6 }} />
            <Text style={styles.roleText}>
              Estudiante de Ingeniería de Sistemas | Dev Móvil
            </Text>
          </View>

          {/* Biografía */}
          <View style={styles.bioContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={18} color="#38BDF8" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Biografía</Text>
            </View>
            <Text style={styles.bioText}>
              Estudiante apasionado por el desarrollo de software y la creación
              de aplicaciones móviles modernas, responsivas e interactivas.
              En constante aprendizaje de nuevas tecnologías nativas y frameworks híbridos.
            </Text>
          </View>

          {/* Separador */}
          <View style={styles.divider} />

          {/* Lista de 3 Tecnologías o Habilidades Favoritas */}
          <View style={styles.skillsSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles-outline" size={18} color="#38BDF8" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Top 3 Habilidades & Tecnologías</Text>
            </View>

            <View style={styles.skillsContainer}>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.skillBadge}>
                  <Ionicons
                    name={skill.iconName}
                    size={22}
                    color={skill.color}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={styles.skillText}>{skill.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Pie de página con créditos */}
        <Text style={styles.footerText}>
          Desarrollado con Expo & React Native • 2026
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Fondo claro (gris muy suave)
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  headerBanner: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0', // Gris suave para el banner
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  card: {
    width: width * 0.9,
    maxWidth: 420,
    backgroundColor: '#FFFFFF', // Fondo blanco puro para la tarjeta
    borderRadius: 24,
    padding: 24,
    marginTop: -60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08, // Sombra más sutil
    shadowRadius: 15,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Borde gris claro
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#0EA5E9', // Azul un poco más intenso para resaltar sobre fondo claro
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#FFFFFF', // Borde blanco para que se vea limpio
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A', // Texto oscuro (casi negro)
    textAlign: 'center',
    marginBottom: 6,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // Fondo gris muy suave
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleText: {
    color: '#0EA5E9', // Azul
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  bioContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC', // Fondo casi blanco con un tono gris
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A', // Oscuro
  },
  bioText: {
    fontSize: 14,
    color: '#475569', // Gris medio, legible
    lineHeight: 22,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
  },
  skillsSection: {
    width: '100%',
  },
  skillsContainer: {
    gap: 10,
    marginTop: 8,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Fondo claro para cada badge
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skillText: {
    color: '#1E293B', // Texto oscuro
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 24,
    color: '#94A3B8', // Gris medio
    fontSize: 12,
  },
});