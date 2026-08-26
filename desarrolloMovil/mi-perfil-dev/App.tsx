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

const { width } = Dimensions.get('window');

export default function App() {
  // Lista de 3 tecnologías / habilidades favoritas
  const skills = [
    { id: '1', title: 'React Native & TypeScript', icon: '⚡', color: '#00D8FF' },
    { id: '2', title: 'JavaScript (ES6+) & Mobile UI', icon: '🚀', color: '#F7DF1E' },
    { id: '3', title: 'Git & Expo Tooling', icon: '🛠️', color: '#4630EB' },
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
              source={require('./assets/avatar.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.onlineBadge} />
          </View>

          {/* Nombre Completo */}
          <Text style={styles.name}>Juan Carlos Añez Ahumada</Text>

          {/* Rol / Carrera */}
          <View style={styles.roleTag}>
            <Text style={styles.roleText}>
              🎓 Estudiante de Ingeniería de Sistemas | Dev Móvil
            </Text>
          </View>

          {/* Biografía */}
          <View style={styles.bioContainer}>
            <Text style={styles.sectionTitle}>📝 Biografía</Text>
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
            <Text style={styles.sectionTitle}>
              🚀 Top 3 Habilidades & Tecnologías
            </Text>

            <View style={styles.skillsContainer}>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.skillBadge}>
                  <Text style={styles.skillIcon}>{skill.icon}</Text>
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
    backgroundColor: '#0F172A', // Fondo oscuro moderno (Slate 900)
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  headerBanner: {
    width: '100%',
    height: 120,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  card: {
    width: width * 0.9,
    maxWidth: 420,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginTop: -60,
    alignItems: 'center',
    // Sombras para iOS y Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#334155',
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
    borderColor: '#38BDF8',
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
    borderColor: '#1E293B',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 6,
  },
  roleTag: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  roleText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  bioContainer: {
    width: '100%',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#334155',
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
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  skillIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  skillText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 24,
    color: '#64748B',
    fontSize: 12,
  },
});
